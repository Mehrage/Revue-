"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteReviewButton({ prNumber, repoName }: { prNumber: number, repoName: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Delete this AI review and try again?")) return
    
    setIsDeleting(true)
    try {
      const res = await fetch("/api/review/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prNumber, repoName }),
      })

      if (res.ok) {
        router.refresh() // This triggers the server component to re-fetch data
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors group disabled:opacity-50"
      title="Delete Review"
    >
      <Trash2 className={`w-4 h-4 ${isDeleting ? 'text-gray-500' : 'text-gray-400 group-hover:text-rose-500'}`} />
    </button>
  )
}