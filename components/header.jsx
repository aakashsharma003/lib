"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, User, Library } from "lucide-react";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { SearchForm } from "./search-form";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  const { userId } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/home" className="flex items-center gap-2 shrink-0">
            <Library className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="font-bold text-xl sm:text-2xl tracking-tight hidden sm:block">Library</span>
          </Link>
          <SearchForm />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
          <ModeToggle />
          {userId ? (
            <>
              <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-foreground rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center justify-center sm:ml-2">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 sm:w-9 sm:h-9" } }} />
              </div>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button variant="default" className="rounded-full px-4 font-medium transition-all h-9 sm:h-10 text-sm">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
