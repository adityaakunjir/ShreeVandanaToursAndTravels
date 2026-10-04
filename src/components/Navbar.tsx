"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <h2>
          Vandana<span>Travels</span>
        </h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link href="#" className="active">
            Home
          </Link>
        </li>
        <li>
          <Link href="#">India Tours</Link>
        </li>
        <li>
          <Link href="#">World Tours</Link>
        </li>
        <li>
          <Link href="#">Services</Link>
        </li>
        <li>
          <Link href="#">Gallery</Link>
        </li>
      </ul>
      <div className="nav-actions">
        <button className="btn-login">Login</button>
        <button className="btn-primary">Book Now</button>
      </div>
    </nav>
  );
}
