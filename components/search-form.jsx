"use client";

import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      searchTerm ? params.set("search", searchTerm) : params.delete("search");

      // Navigate to /home with search params instead of root
      await router.push(`/home?${params.toString()}`);
      setIsLoading(false);
    },
    [searchTerm, searchParams, router]
  );

  return (
    <form className="tour-search relative flex items-center w-full max-w-[180px] sm:max-w-xs md:max-w-sm group" onSubmit={handleSearch}>
      <div className="absolute left-3 flex items-center justify-center pointer-events-none text-muted-foreground group-focus-within:text-foreground transition-colors">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      <Input
        type="search"
        placeholder="Search"
        className="w-full text-sm rounded-full bg-secondary/50 border-transparent hover:border-border focus-visible:ring-0 focus-visible:bg-background focus-visible:border-border pl-10 pr-4 transition-all h-9 sm:h-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
      />
    </form>
  );
}

export function SearchForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchFormContent />
    </Suspense>
  );
}
