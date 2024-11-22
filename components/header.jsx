import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Library, Search } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm text-foreground">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Library className="h-6 w-6" />
          <span className="font-bold">Library</span>
        </Link>
        <div className="flex-1 flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search videos..."
            className="w-full md:w-[300px] lg:w-[400px]"
          />
          <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

