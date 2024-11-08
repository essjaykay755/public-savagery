import { Button } from '@/components/ui/button'

type Platform = 'Reddit' | 'YouTube' | 'Facebook' | 'X' | 'Instagram'
const platforms: Platform[] = ['Reddit', 'YouTube', 'Facebook', 'X', 'Instagram']

export function PlatformFilter({ filter, setFilter }: { filter: Platform | 'All', setFilter: (platform: Platform | 'All') => void }) {
  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'All' ? 'default' : 'outline'}
          onClick={() => setFilter('All')}
        >
          All
        </Button>
        {platforms.map((platform) => (
          <Button
            key={platform}
            variant={filter === platform ? 'default' : 'outline'}
            onClick={() => setFilter(platform)}
          >
            {platform}
          </Button>
        ))}
      </div>
    </nav>
  )
}