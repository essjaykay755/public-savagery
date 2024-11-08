import { useState } from 'react'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Platform = 'Reddit' | 'YouTube' | 'Facebook' | 'X' | 'Instagram'

interface SocialMediaPost {
  id: string
  platform: Platform
  votes: number
  timestamp: number
  imageUrl: string
  sourceLink?: string
}

const platformColors: Record<Platform, string> = {
  Reddit: 'bg-orange-500 dark:bg-orange-600',
  YouTube: 'bg-red-500 dark:bg-red-600',
  Facebook: 'bg-blue-500 dark:bg-blue-600',
  X: 'bg-neutral-900 dark:bg-neutral-800',
  Instagram: 'bg-purple-500 dark:bg-purple-600',
}

const platformIcons: Record<Platform, JSX.Element> = {
  Reddit: (
    <svg className="w-24 h-24 absolute top-2 right-2 opacity-20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  ),
  YouTube: (
    <svg className="w-24 h-24 absolute top-2 right-2 opacity-20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Facebook: (
    <svg className="w-24 h-24 absolute top-2 right-2 opacity-20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  X: (
    <svg className="w-24 h-24 absolute top-2 right-2 opacity-20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: (
    <svg className="w-24 h-24 absolute top-2 right-2 opacity-20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  ),
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function SocialMediaCard({ post }: { post: SocialMediaPost }) {
  const [votes, setVotes] = useState(post.votes)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleVote = async (value: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newVotes = votes + value
    setVotes(newVotes)
    const postRef = doc(db, 'posts', post.id)
    await updateDoc(postRef, { votes: newVotes })
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(post.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${post.platform}-post-${post.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <>
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${platformColors[post.platform]} text-white cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6 relative">
          {platformIcons[post.platform]}
          <h3 className="text-lg font-semibold mb-2 relative z-10">{post.platform}</h3>
          <div className="aspect-video bg-black/20 mb-4 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt="Social media post"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleVote(1, e)}
              className="hover:bg-white/20"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="font-bold">{votes}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleVote(-1, e)}
              className="hover:bg-white/20"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div>{formatDate(post.timestamp)}</div>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={`p-1 rounded ${platformColors[post.platform]}`}>
                {post.platform}
              </span>
              <span className="text-muted-foreground">
                {formatDate(post.timestamp)}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img
              src={post.imageUrl}
              alt="Social media post"
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleDownload}
                className="rounded-full"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleVote(1, e)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg">{votes}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleVote(-1, e)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {post.sourceLink && (
            <a href={post.sourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Source
            </a>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}