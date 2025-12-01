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
      easing: "easeOutExpo",
    });
  }, []);

  const NavLink = ({ href, children }) => (
    <Link href={href} className="group relative inline-flex items-center hover:opacity-70">
      <span>{children}</span>
      {/* underline that grows from the left */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full bg-current origin-left
                   scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );

  return (
    <div className="sticky top-0 z-50 backdrop-blur">
      <header className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4" ref={ref}>
        <Link href="/" className="font-semibold tracking-wide hover:opacity-90">
          <img src="/zuii-white.svg" alt="" className="h-6 w-auto" />
        </Link>
        <nav className="flex gap-6">
          <NavLink href="/work">Work</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>
      </header>
    </div>
  );
}
