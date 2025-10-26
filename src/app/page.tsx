'use client';
import { useEffect, useState } from "react";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setVideoSrc(isMobile ? "/assets/ofside-mobile.mp4" : "/assets/ofside.mp4");

    // Show popup only if not closed in this session
    if (!sessionStorage.getItem("onboardingBannerClosed")) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    sessionStorage.setItem("onboardingBannerClosed", "true");
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          {/* Blurred, semi-transparent background */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/10 z-0"></div>
            <div
              className="relative mt-12 bg-[#e4d800] rounded-lg shadow-lg z-10 flex justify-center items-center"
              style={
                typeof window !== "undefined" && window.innerWidth < 768
                  ? { width: "90%", maxWidth: "90%", maxHeight: "90vh", margin: "auto" }
                  : { width: "auto", maxWidth: "60%", maxHeight: "90vh", margin: "auto" }
              }
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                onClick={handleClose}
                aria-label="Close"
              >
                &times;
              </button>
              <img
                src={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "/assets/onboarding_banner_mobile.PNG"
                    : "/assets/onboarding_banner.PNG"
                }
                alt="Onboarding Banner"
                className={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "rounded object-contain w-full"
                    : "rounded object-contain"
                }
              />
            </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {videoSrc && (
          <video
            className="rounded-lg shadow-lg w-full h-auto z-0"
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
    </>
  );
}
