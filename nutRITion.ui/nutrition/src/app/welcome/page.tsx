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
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#F76902] hover:bg-[#E08C2B] text-white font-bold py-4 px-8 text-xl rounded-xl shadow-lg transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
