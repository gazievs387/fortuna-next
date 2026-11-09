"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const counterId =
  process.env.NODE_ENV === "production" ? 100882496 : null;

function getInitScript(id: number) {
  return `(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for(var j=0;j<document.scripts.length;j++){
      if(document.scripts[j].src===r)return;
    }
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
  })(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
  ym(${id},"init",{
    defer:true,
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
  });`;
}

function getNoScriptFallback(id: number) {
  return {
    __html: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute;left:-9999px" alt="" /></div>`,
  };
}

export function YandexMetrika() {
  if (counterId === null) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {getInitScript(counterId)}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker counterId={counterId} />
      </Suspense>
      <noscript dangerouslySetInnerHTML={getNoScriptFallback(counterId)} />
    </>
  );
}

function PageViewTracker({ counterId: id }: { counterId: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastHitUrl = useRef<string | null>(null);
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    // /images is only a temporary history entry while the photo lightbox is open.
    if (pathname === "/images" || pathname === "/images/") return;

    let cancelled = false;
    const url = `${window.location.origin}${pathname}${searchParamsString ? `?${searchParamsString}` : ""}`;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const sendHit = (attempt = 0) => {
      if (cancelled || lastHitUrl.current === url) return;

      if (typeof window.ym === "function") {
        window.ym(id, "hit", url);
        lastHitUrl.current = url;
        return;
      }

      if (attempt < 20) {
        retryTimer = setTimeout(() => sendHit(attempt + 1), 250);
      }
    };

    sendHit();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [id, pathname, searchParamsString]);

  return null;
}
