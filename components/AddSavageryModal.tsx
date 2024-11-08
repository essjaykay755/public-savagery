import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { storage, db } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'

type Platform = 'Reddit' | 'YouTube' | 'Facebook' | 'X' | 'Instagram'
const platforms: Platform[] = ['Reddit', 'YouTube', 'Facebook', 'X', 'Instagram']

interface AddSavageryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function AddSavageryModal({ isOpen, onClose, onSubmit }: AddSavageryModalProps) {
  const [platform, setPlatform] = useState<Platform>('Reddit')
  const [imageUrl, setImageUrl] = useState('')
  const [sourceLink, setSourceLink] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let uploadedImageUrl = imageUrl

    if (file) {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      uploadedImageUrl = await getDownloadURL(storageRef)
    }

    const newPost = {
      platform,
      imageUrl: uploadedImageUrl,
      sourceLink,
      votes: 0,
      timestamp: Date.now(),
    }

    await addDoc(collection(db, 'posts'), newPost)
    onSubmit()
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Savagery</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Upload Image
              </Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source Link
              </Label>
              <Input
                id="source"
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Savagery</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}