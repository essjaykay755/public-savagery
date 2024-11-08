import { Moon, Sun, Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SearchBar } from './SearchBar'
import { AddSavageryButton } from './AddSavageryButton'

export function Header({ onOpenAddSavagery, onSearch }: { onOpenAddSavagery: () => void, onSearch: (term: string) => void }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold">Public Savagery</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <SearchBar onSearch={onSearch} />
          <AddSavageryButton onClick={onOpenAddSavagery} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}