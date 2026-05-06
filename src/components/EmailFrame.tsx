"use client";

import { useRef, useState } from "react";

export default function EmailFrame({ src }: { src: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(2800);

  return (
    <iframe
      ref={ref}
      src={src}
      width="100%"
      style={{ border: "none", height, display: "block" }}
      onLoad={() => {
        const body = ref.current?.contentDocument?.body;
        if (body) setHeight(body.scrollHeight + 48);
      }}
    />
  );
}
