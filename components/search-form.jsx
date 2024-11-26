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
      await router.push(`/?${params.toString()}`);
      setIsLoading(false);
    },
    [searchTerm, searchParams, router]
  );

  return (
    <form className="flex items-center" onSubmit={handleSearch}>
      <Input
        type="search"
        placeholder="Search videos..."
        className="w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" size="icon" className="ml-2" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
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
