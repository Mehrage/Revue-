"use client"

import { useState } from "react"
import { Sparkles, ChevronDown, ChevronUp, ShieldAlert, FileCode2, MessageSquarePlus, Send, Loader2 } from "lucide-react"

const GOLD = "#c4994a"

export default function ReviewAccordion({ 
  content, 
  diffCode = "", 
  repoOwner, 
  repoName, 
  prNumber 
}: { 
  content: string, 
  diffCode?: string,
  repoOwner?: string,
  repoName?: string,
  prNumber?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [draftIssue, setDraftIssue] = useState("")
  const [draftCode, setDraftCode] = useState("")

  let aiData = { summary: "Analysis unavailable.", impactScore: "Unknown", suggestions: [] as any[] };
  try {
    if (content) {
      // This finds the first '{' and the last '}' to isolate the JSON object
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: If no JSON is found, treat the whole thing as a summary
        aiData.summary = content;
      }
    }
  } catch (e) {
    console.error("Revue Parsing Error:", e);
    aiData.summary = content; 
  }

  const fullLines = diffCode.split('\n').filter(line => 
    !line.startsWith('diff --git') && !line.startsWith('index ') && 
    !line.startsWith('--- a/') && !line.startsWith('+++ b/')
  );

  const totalAdditions = fullLines.filter(l => l.startsWith('+')).length;
  const totalDeletions = fullLines.filter(l => l.startsWith('-')).length;
  const rawLines = fullLines.slice(0, 100); 

  let oldNum = 0; let newNum = 0;

  const parsedCode = rawLines.map((line, index) => {
    let type = 'context'; let oNum: number | string = ''; let nNum: number | string = '';

    if (line.startsWith('@@')) {
      type = 'hunk';
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) { oldNum = parseInt(match[1]) - 1; newNum = parseInt(match[2]) - 1; }
    } else if (line.startsWith('+')) {
      type = 'add'; newNum++; nNum = newNum;
    } else if (line.startsWith('-')) {
      type = 'remove'; oldNum++; oNum = oldNum;
    } else {
      oldNum++; newNum++; oNum = oldNum; nNum = newNum;
    }
    return { type, content: line, oNum, nNum, index };
  });

  const topSuggestion = aiData.suggestions?.[0];

  const handleStartEdit = () => {
    setDraftIssue(topSuggestion?.issue || "");
    setDraftCode(topSuggestion?.codeSnippet || "");
    setEditMode(true);
  }

  const handlePostToGitHub = async () => {
    if (!repoOwner || !repoName || !prNumber) {
      alert("Missing repository info. Refresh the dashboard.");
      return;
    }
    setIsSubmitting(true);
    const markdownBody = `### ✨ Revue AI Suggestion\n\n${draftIssue}\n\n${draftCode ? `\`\`\`typescript\n${draftCode}\n\`\`\`` : ""}`;

    try {
      const res = await fetch("/api/review/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoOwner, repoName, prNumber, commentBody: markdownBody })
      });
      if (!res.ok) throw new Error("Failed to post");
      alert("Comment successfully posted to GitHub!");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Error: Could not reach GitHub.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full flex flex-col items-end">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-emerald-500/10"
        style={{ color: "rgba(52,211,153,0.7)", border: "1px solid rgba(52,211,153,0.15)", background: isOpen ? "rgba(52,211,153,0.05)" : "transparent" }}
      >
        <Sparkles className="w-3 h-3" />
        {isOpen ? "Hide Review" : "View Review"}
        {isOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
      </button>

      {isOpen && (
        <div className="w-full mt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col lg:flex-row gap-5">

            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: GOLD }}>
                  <Sparkles className="w-3 h-3" /> Overview
                </h3>
                <p className="text-xs leading-relaxed text-[#c0c3d4] mb-4">{aiData.summary}</p>
                <div className="pt-4 flex items-end justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#52556a] block mb-1">Impact Score</span>
                    <span className="text-xl font-semibold text-amber-400">{aiData.impactScore}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#52556a] block mb-1">Code Delta</span>
                    <div className="text-lg font-mono flex items-center justify-end gap-2 mt-1">
                      <span className="text-emerald-400">+{totalAdditions}</span>
                      <span className="text-[#3a3d50] text-sm">/</span>
                      <span className="text-rose-400">-{totalDeletions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 rounded-2xl flex flex-col overflow-hidden max-h-[700px]"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
              
              <div className="flex-1 overflow-y-auto py-4 font-mono text-[11px] leading-6 bg-[#07090f]/50 custom-scrollbar relative">
                
                {parsedCode.map((line, i) => (
                  <div key={i} className={`flex items-start px-2 ${line.type === 'add' ? 'bg-emerald-500/[0.08]' : line.type === 'remove' ? 'bg-rose-500/[0.08]' : 'hover:bg-white/[0.02]'}`}>
                    <div className="w-8 text-right pr-3 select-none text-[#52556a]">{line.oNum}</div>
                    <div className="w-8 text-right pr-3 select-none text-[#52556a]">{line.nNum}</div>
                    <div className={`flex-1 whitespace-pre pl-2 ${line.type === 'add' ? 'text-emerald-300' : line.type === 'remove' ? 'text-rose-300' : 'text-[#8b8d98]'}`}>{line.content}</div>
                  </div>
                ))}

                {topSuggestion && (
                  <div className="flex mt-6 mb-4 px-2">
                    <div className="flex-1 rounded-lg border overflow-hidden"
                      style={{ background: "#0d1117", borderColor: editMode ? GOLD : "rgba(255,255,255,0.1)" }}>
                      
                      {!editMode ? (
                        <div className="p-4 flex flex-col gap-3 font-sans">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Revue AI</span>
                            </div>
                            <button onClick={handleStartEdit} className="text-[10px] font-semibold text-[#52556a] hover:text-white flex items-center gap-1 transition-colors">
                              <MessageSquarePlus className="w-3 h-3" /> Prepare Comment
                            </button>
                          </div>
                          <p className="text-xs text-[#c0c3d4] leading-relaxed">{topSuggestion.issue}</p>
                          {topSuggestion.codeSnippet && (
                            <pre className="p-3 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                              {topSuggestion.codeSnippet}
                            </pre>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 flex flex-col gap-6 font-sans animate-in fade-in duration-300">
                           <div className="flex items-center justify-between border-b border-white/5 pb-3">
                             <span className="font-bold uppercase tracking-widest text-[11px] text-amber-400">Drafting Revue Comment</span>
                           </div>
                           
                           <div className="flex flex-col gap-2">
                              <label className="text-[10px] text-[#8b8d98] uppercase tracking-wider font-bold">Explanation</label>
                              <textarea 
                                value={draftIssue}
                                onChange={(e) => setDraftIssue(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg p-4 text-sm text-[#e6e8f0] outline-none min-h-[120px] resize-y"
                              />
                           </div>

                           <div className="flex flex-col gap-2">
                              <label className="text-[10px] text-[#8b8d98] uppercase tracking-wider font-bold">Code Fix</label>
                              <textarea 
                                value={draftCode}
                                onChange={(e) => setDraftCode(e.target.value)}
                                spellCheck={false}
                                className="w-full bg-[#07090f] border border-white/10 rounded-lg p-4 text-[12px] font-mono text-emerald-300 outline-none min-h-[250px] resize-y"
                              />
                           </div>

                           <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                              <button onClick={() => setEditMode(false)} className="text-xs text-[#52556a] px-4 font-semibold">Cancel</button>
                              <button onClick={handlePostToGitHub} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-black" style={{ background: GOLD }}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post to GitHub
                              </button>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}