"use client";

import { useEffect } from "react";

export default function ImagesRedirect() {
  useEffect(() => {
    window.location.replace("/");
  }, []);

  return <main aria-live="polite"></main>;
}
