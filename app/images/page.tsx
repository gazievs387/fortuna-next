import type { Metadata } from "next";
import ImagesRedirect from "./redirect";

export const metadata: Metadata = {
  title: "Переход на главную",
  robots: { index: false, follow: false },
};

export default function ImagesPage() {
  return <ImagesRedirect />;
}
