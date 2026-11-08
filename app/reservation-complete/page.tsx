import type { Metadata } from "next";
import "./reservation_complete.css";

export const metadata: Metadata = { title: "Заявка отправлена", robots: { index: false, follow: false } };

export default function ReservationComplete() {
  return <main>
    <div id="logo_text"><a href="/"><span>Фортуна</span></a></div>
    <div id="main"><h4>Ваша заявка на бронирование успешно отправлена</h4><br/><p>Мы рассмотрим вашу заявку и ответим в ближайшее время</p><br/><br/><br/><br/><p>С уважением, база отдыха Фортуна</p></div>
    <div id="to_main_btn"><a href="/"><button>Обратно на главную</button></a></div>
  </main>;
}
