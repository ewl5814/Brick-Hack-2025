"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen">
      {/* Background Image */}
      <Image
        src="/home.png"
        alt="Some burritos"
        fill
        style={{ objectFit: "cover" }}
      />
      {/* Centered Button Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Large Text */}
        <h1 className="text-white text-8xl font-bold tracking-wide mb-10">
          nut<span className="text-[#F76902]">RIT</span>ion
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#F76902] hover:bg-[#E08C2B] active:bg-[#F76902] text-white font-bold py-4 px-8 text-xl rounded-xl shadow-lg transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
