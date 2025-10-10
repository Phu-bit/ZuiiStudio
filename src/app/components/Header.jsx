"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {animate as anime} from 'animejs';
import {stagger} from "animejs"


export default function Header() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    anime('.square',{
      targets: ref.current.children,
      translateY: [-8, 0],
      opacity: [0, 1],
      duration: 900,
      delay: stagger(70),
      easing: "easeOutExpo"
    });
  }, []);

  return (
    <div className="sticky top-0 z-50 backdrop-blur">
      <header className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4" ref={ref}>
        <Link href="/" className="font-semibold tracking-wide hover:opacity-90">
          <img src="/zuii-white.svg" alt="" className="h-6 w-auto" />
        </Link>
        <nav className="flex gap-6">
          <Link href="/work" className="hover:opacity-70">Work</Link>
          <Link href="/about" className="hover:opacity-70">About</Link>
        </nav>
      </header>
    </div>
  );
}
