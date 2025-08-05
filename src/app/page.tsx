'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setVideoSrc(isMobile ? "/assets/ofside-mobile.mp4" : "/assets/ofside.mp4");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      {videoSrc && (
      <video
        className="fixed top-0 left-0 w-screen h-screen object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      )}
    
    </div>
  );
}
