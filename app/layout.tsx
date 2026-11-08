import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const yandexMetrika = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(100882496,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`;

export const metadata: Metadata = {
  title: "База отдыха Фортуна в Лдзаа, Абхазия | Коттеджи у моря",
  description:
    "База отдыха Фортуна в селе Лдзаа рядом с Пицундой: 3 комфортабельных коттеджа, зеленый двор, парковка, Wi-Fi и море примерно в 6 минутах ходьбы.",
  metadataBase: new URL("https://fortuna-abkhazia.ru"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large", googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { title: "База отдыха Фортуна в Лдзаа, Абхазия", description: "Комфортабельные коттеджи, зеленый двор, парковка, Wi-Fi и море примерно в 6 минутах ходьбы.", url: "https://fortuna-abkhazia.ru/", siteName: "База отдыха Фортуна", locale: "ru_RU", type: "website", images: [{ url: "/images/image1.jpg", alt: "База отдыха Фортуна в Лдзаа, Абхазия" }] },
  twitter: { card: "summary_large_image", title: "База отдыха Фортуна в Лдзаа, Абхазия", description: "Коттеджи у моря рядом с Пицундой: зеленый двор, парковка, Wi-Fi и спокойный семейный отдых.", images: ["/images/image1.jpg"] },
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => ({ url: `/icons/apple-icon-${size}x${size}.png`, sizes: `${size}x${size}` })),
    other: [{ rel: "manifest", url: "/icons/manifest.json" }],
  },
  other: { "msapplication-TileColor": "#ffffff", "msapplication-TileImage": "/icons/ms-icon-144x144.png", "theme-color": "#ffffff" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
  <body>
    {children}
    <noscript><div><img src="https://mc.yandex.ru/watch/100882496" style={{position:"absolute",left:"-9999px"}} alt="" /></div></noscript>
    <Script id="yandex-metrika" strategy="afterInteractive" dangerouslySetInnerHTML={{__html:yandexMetrika}} />
    <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
  </body>
    </html>
  );
}
