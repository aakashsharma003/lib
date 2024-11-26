'use client'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Menu, Search, Bell, User, Library } from 'lucide-react'
import { useState,  useCallback  } from "react"
import { useAuth,SignInButton } from "@clerk/nextjs";
import { useRouter,  useSearchParams } from "next/navigation"

export function Header() {
  const router = useRouter();
   const { userId } = useAuth();
    const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams);
      searchTerm ? params.set("search", searchTerm) : params.delete("search");
      router.push(`/?${params.toString()}`);
    },
    [searchTerm, searchParams, router]
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm text-foreground">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-around ">
          {/* <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-6 w-6" />
          </Button> */}
          <Link href="/" className="flex items-center space-x-2">
            <Library className="h-6 w-6" />
            <span className="font-bold text-xl">Library</span>
          </Link>
        </div>
        <div className="flex-1 mx-4 max-w-xl">
          <form className="flex items-center" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search videos..."
              className="w-full"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <Button type="submit" size="icon" className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        {userId ? (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <SignInButton className="bg-black text-white rounded-xl md:rounded-2xl px-6 py-3 border-2 md:px-3 md:py-2 border-black hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" />
        )}
      </div>
    </header>
  );
}






