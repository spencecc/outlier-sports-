"use client";

import { useEffect, useRef } from "react";

export default function BeehiivSignup() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    script.setAttribute("data-beehiiv-form", "96e9cdee-25d7-44df-a91f-ebe3685e6237");
    container.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
