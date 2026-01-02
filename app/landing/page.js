import ArcGalleryHero from "@/components/arc-gallary-hero"

export default function Home() {
  // Using actual images from public folder
 const images = [
  "https://cdn.simpleicons.org/vimeo",
  "https://cdn.simpleicons.org/dailymotion",
  "https://cdn.simpleicons.org/flickr",
  "https://cdn.simpleicons.org/rumble",
  "https://cdn.simpleicons.org/dtube",
  "https://cdn.simpleicons.org/peertube",
  "https://cdn.simpleicons.org/twitch",
  "https://cdn.simpleicons.org/odysee",
  "https://cdn.simpleicons.org/youtube",
  "https://cdn.simpleicons.org/kick",
]


  return (
    <main className="relative min-h-screen bg-background">
      <ArcGalleryHero
        images={images}
        startAngle={20}
        endAngle={160}
        radiusLg={480}
        radiusMd={360}
        radiusSm={260}
        cardSizeLg={120}
        cardSizeMd={100}
        cardSizeSm={80}
        className="pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24"
      />
    </main>
  )
}
