"use client";

import { useEffect } from "react";
import "./components/vitrine/vitrine.css";

import Nav from "./components/vitrine/Nav";
import Hero from "./components/vitrine/Hero";
import Trust from "./components/vitrine/Trust";
import Constat from "./components/vitrine/Constat";
import Solution from "./components/vitrine/Solution";
import Science from "./components/vitrine/Science";
import Process from "./components/vitrine/Process";
import Showcase from "./components/vitrine/Showcase";
import Citation from "./components/vitrine/Citation";
import Tarif from "./components/vitrine/Tarif";
import Why from "./components/vitrine/Why";
import Conformite from "./components/vitrine/Conformite";
import Faq from "./components/vitrine/Faq";
import Cta from "./components/vitrine/Cta";
import Footer from "./components/vitrine/Footer";

export default function HomePage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".vitrine .reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="vitrine">
      <Nav />
      <Hero />
      <Trust />
      <Constat />
      <Solution />
      <Science />
      <Process />
      <Showcase />
      <Citation />
      <Tarif />
      <Why />
      <Conformite />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}