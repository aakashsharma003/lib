"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, User, Library } from "lucide-react";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { SearchForm } from "./search-form";


export function Header() {
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm text-foreground">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex items-center space-x-2">
            <Library className="h-6 w-6" />
            <span className="font-bold text-xl">Library</span>
          </Link>
        </div>
        <div className="flex-1 mx-4 max-w-xl">
          <SearchForm />
        </div>
        {userId ? (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <UserButton className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <SignInButton className="bg-black text-white rounded-xl md:rounded-2xl px-6 py-3 border-2 md:px-3 md:py-2 border-black hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" />
        )}
      </div>
    </header>
  );
}
