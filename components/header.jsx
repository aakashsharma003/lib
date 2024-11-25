'use client'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Menu, Search, Bell, User, Library } from 'lucide-react'
import { useEffect, useState } from "react"
import axios from "axios"

export function Header() {
  const [query, setquery] = useState("premanandji");
  //  const getVideos = async() => {
  //   const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // Our YouTube API key
  //   const apiURL = process.env.NEXT_PUBLIC_YOUTUBE_API_URL;  // Base URL for YouTube API

  //   try {
  //     // Call the YouTube API using axios
  //     const response = await axios.get(`${apiURL}/search?part=snippet&key=${apiKey}&type=video&q=${query}`);

  //     // Check if response is valid
  //     if (response.status === 200) {
  //       console.log("data", response?.data);
  //       updateData(response?.data?.items);  // Store fetched videos in state
  //     } else {
  //       throw new Error('Failed to fetch videos');
  //     }
  //   } catch (err) {
  //     // setError('An error occurred while fetching videos');
  //     console.log(err); // Log the error
  //   }
  // }
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

  //  getVideos()
  };
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
               onChange={(e) => {setquery(e.target.value)}}
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






