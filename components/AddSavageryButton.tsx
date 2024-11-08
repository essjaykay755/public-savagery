import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AddSavageryButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" /> Add Savagery
    </Button>
  )
}