import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import React from "react";
import { FaUserShield } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 h-16 flex justify-center items-center z-30 bg-f1-black/80 backdrop-blur-xl">
      <div className="w-full max-w-[1280px] flex justify-between items-center md:px-8 px-6">
        <Link href={"/"}>
          <p className="font-bold text-xl">
            F1® Foresight <span className="text-f1-red">2024</span>
          </p>
        </Link>
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2.5 rounded-md text-xs bg-white hover:bg-slate-200 text-f1-black flex items-center gap-x-1">
              <FaUserShield className="text-lg" />
              SIGN IN
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
