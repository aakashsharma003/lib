import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Menu, Search, Bell, User, Library } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm text-foreground">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Library className="h-6 w-6" />
            <span className="font-bold text-xl">Library</span>
          </Link>
        </div>
        <div className="flex-1 mx-4 max-w-xl">
          <form className="flex items-center">
            <Input
              type="search"
              placeholder="Search videos..."
              className="w-full"
            />
            <Button type="submit" size="icon" className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}






