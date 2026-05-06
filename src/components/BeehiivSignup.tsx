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
    script.setAttribute("data-beehiiv-form", "4bb68e8c-a4c7-407d-9b6d-f06457ddb136");
    container.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
