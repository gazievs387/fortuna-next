"use client";
import axios from "axios";
import Script from "next/script";
import { FormEvent, useEffect, useState } from "react";
const photos = [
  ["/images/q_images/image2.webp", "/images/image2.jpg", "Двор базы отдыха Фортуна"],
  ["/images/q_images/image3.webp", "/images/image3.jpg", "Коттедж базы отдыха Фортуна"],
  ["/images/img1/image (13).jpeg", "/images/img1/image (13).jpeg", "Номер для отдыха на базе Фортуна"],
  ["/images/q_images/image6.webp", "/images/image6.jpg", "Зеленая территория базы отдыха Фортуна"],
  ["/images/q_images/image10.webp", "/images/image10.jpg", "Место отдыха на территории базы Фортуна"],
  ["/images/q_images/image7.webp", "/images/image7.jpg", "Комфортный двор базы отдыха Фортуна"],
  ["/images/q_images/image8.webp", "/images/image8.jpg", "Территория базы отдыха Фортуна в Лдзаа"],
  ["/images/img1/image (4).jpeg", "/images/img1/image (4).jpeg", "Интерьер номера на базе отдыха Фортуна"],
  ["/images/q_images/image9.webp", "/images/image9.jpg", "Коттеджи базы отдыха Фортуна рядом с Пицундой"],
];

function formatRussianDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function ContactForm({ close }: { close: () => void }) {
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState({ date1: "", date2: "" });
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("https://functions.yandexcloud.net/d4e813m5ckkctu4sdp7u",
        Object.fromEntries(new FormData(e.currentTarget)),
        { headers: { "Content-Type": "application/json" } },
      );

      setStatus("success");
      window.location.href = "/reservation-complete/";
    } catch {
      setStatus("error");
    }
  }
  return <form method="post" onSubmit={send}>
    <span style={{fontSize:14,color:"gray"}}>Кликните по элементу даты, чтобы выбрать</span><br/>
    C <input className="date11" required name="date1" type="date" value={dates.date1} onChange={(event) => setDates((current) => ({ ...current, date1: event.target.value }))} />
    <span id="date2">до <input className="date11" required name="date2" type="date" value={dates.date2} onChange={(event) => setDates((current) => ({ ...current, date2: event.target.value }))} /></span>
    <br/>{(dates.date1 || dates.date2) && <span aria-live="polite" style={{ display: "block", fontSize: 14, color: "gray", marginTop: 4 }}>{formatRussianDate(dates.date1)}{dates.date1 && dates.date2 ? " — " : ""}{formatRussianDate(dates.date2)}</span>}<br/>
    <label>Телефон</label><br/><input id="telephone1" className="form11" required name="phone_number" type="tel"/><br/><br/>
    <label>Email</label><br/><input id="email1" className="form11" name="email" type="email" placeholder="Необязательно"/><br/><br/>
    <label>Сообщение</label><br/><textarea id="text-area1" className="form11" name="message" rows={4} cols={50} placeholder="Ваше сообщение(необязательно)"/><br/>
    <button id="button1" disabled={status === "sending"}>{status === "sending" ? "Отправка…" : "Отправить"}</button>
    <span id="modal_form_text" style={{color:"gray",fontSize:15,marginTop:6,display:"block"}}>{status === "error" ? "Не удалось отправить. Попробуйте ещё раз." : "Мы ответим вам в ближайшее время"}</span>
  </form>;
}
export default function Home() {
  const [modal, setModal] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    type LightboxInstance = { props: { onOpen?: () => void; onClose?: () => void }; close: () => void; __fortunaHistoryReady?: boolean };
    const browserWindow = window as Window & { fsLightbox?: LightboxInstance };
    let lightboxHistoryEntry = false;
    let backTriggeredClose = false;

    const setupLightboxHistory = () => {
      const lightbox = browserWindow.fsLightbox;
      if (!lightbox || lightbox.__fortunaHistoryReady) return;
      lightbox.__fortunaHistoryReady = true;

      lightbox.props.onOpen = () => {
        if (window.location.pathname !== "/images") {
          window.history.pushState({ ...window.history.state, fortunaLightbox: true }, "", "/images");
          lightboxHistoryEntry = true;
        }
      };

      lightbox.props.onClose = () => {
        if (lightboxHistoryEntry && !backTriggeredClose) {
          lightboxHistoryEntry = false;
          window.history.back();
        }
        backTriggeredClose = false;
      };
    };

    const handlePopState = () => {
      if (lightboxHistoryEntry && window.location.pathname === "/") {
        lightboxHistoryEntry = false;
        backTriggeredClose = true;
        browserWindow.fsLightbox?.close();
      }
    };

    window.addEventListener("popstate", handlePopState);
    const interval = window.setInterval(setupLightboxHistory, 100);
    setupLightboxHistory();

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.clearInterval(interval);
    };
  }, []);
  return (
    <main>
      <Script src="/fslightbox.js" strategy="afterInteractive" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"LodgingBusiness",name:"База отдыха Фортуна",url:"https://fortuna-abkhazia.ru/",image:"https://fortuna-abkhazia.ru/images/image1.jpg",description:"База отдыха Фортуна в селе Лдзаа рядом с Пицундой: 3 комфортабельных коттеджа, зеленый двор, парковка, Wi-Fi и море примерно в 6 минутах ходьбы.",telephone:"+79409916161",priceRange:"1500-4000 RUB",address:{"@type":"PostalAddress",addressCountry:"Абхазия",addressLocality:"Лдзаа",streetAddress:"ул. Назадзе, 54/д"},amenityFeature:["Wi-Fi","Парковка","Летняя кухня","Мангал"].map(name=>({"@type":"LocationFeatureSpecification",name,value:true})),sameAs:["https://hochu-na-yuga.ru/abhazia/ldzaa-bazy-otdykha/nazadze-54d-ldzaa/"]})}} />
      <div id="part1_01">
        <header>
          <h2>Фортуна</h2>
          <span id="phone_number">+7 (940) 991-61-61 WhatsApp Telegram Max</span>
          <div id="header1"></div>
        </header>
        <div id="part1">
          <div id="part1_1">
            <div id="i4"><h1 id="i2">База отдыха Фортуна</h1></div>
            <img
              id="part1_img"
              src="/images/image1.webp"
              alt="База отдыха Фортуна в селе Лдзаа рядом с Пицундой"
              width="700"
              fetchPriority="high"
              draggable={false}
            />
            <div id="i5">
              Адрес: р. Абхазия, г. Пицунда, с. Лдзаа, ул. Назадзе, 54/д
              <br />
              +7 (940) 991-61-61 - Фатима (WhatsApp Telegram Max)
            </div>
          </div>
        <div id="part1_2">
            <button className="btn1 btn_mobile" onClick={() => setModal("booking")}>Забронировать</button>
            <button className="btn1 btn_mobile" style={{marginLeft:15}} onClick={() => setModal("question")}>
                Задать вопрос
              </button>
            <h2>
              <span className="h1_word">Удобство</span> <span className="h1_word">Комфорт</span>{" "}
              <span className="h1_word">Спокойствие</span>
            </h2>
            <p>Мы предоставляем все необходимое для проживания</p>
            <p>📌 ~ 6 мин до моря размеренным шагом</p>
            <p><img width="20" style={{marginRight:4}} src="/svgs/car.svg" alt=""/> ~ 2 мин на машине</p>
            <button className="btn1 btn2 btn_desktop" onClick={() => setModal("booking")}>Забронировать</button>
            <button className="btn1 btn_desktop" style={{marginLeft:15}} onClick={() => setModal("question")}>
                Задать вопрос
              </button>
          </div>
        </div>
      </div>
      <div id="part2">
        <div className="container text-center">
          {[0, 1, 2].map((row) => (
            <div className="row" key={row}>
              {photos.slice(row * 3, row * 3 + 3).map(([thumb, full, alt]) => (
                <div className="col" key={thumb}>
                  <a data-fslightbox="gallery" href={full}>
                    <img className="img_in_imgs" src={thumb} alt={alt} loading="lazy"
                      style={thumb.includes("image (13)") ? { aspectRatio: "1 / 1", objectFit: "cover" } : undefined} />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div id="part3">
        <p>
          База отдыха Фортуна расположена в селе Лдзаа, в трех километрах от
          города Пицунда.
          <br />
          Мы предоставляем все необходимое для комфортного отдыха
        </p>
        {[
          "Летняя кухня",
          "Wi-Fi интернет",
          "Мангал",
          "Зеленый двор",
          "Большая парковка",
          "Гладильная + утюг",
          "СВЧ",
          "Спутниковое ТВ",
        ].map((x) => (
          <p key={x}>- {x}</p>
        ))}
        <p id="part3_01">
          На территории расположено 3 комфортабельных коттеджа. Не упустите
          возможность и успейте забронировать все 3 <span>для совместного семейного отдыха!</span>
        </p>
      </div>
      <section id="part4">
        <div id="reviews"><div className="row d-flex justify-content-center"><div className="col-md-10 col-xl-8 text-center"><h3 className="mb-4">Отзывы о нас</h3><a style={{textDecoration:"none"}} href="https://hochu-na-yuga.ru/abhazia/ldzaa-bazy-otdykha/nazadze-54d-ldzaa/#:~:text=%D0%9E%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%20%D0%BD%D0%B0%20%D0%BA%D0%B0%D1%80%D1%82%D0%B5-,%D0%9E%D1%82%D0%B7%D1%8B%D0%B2%D1%8B,-%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2"><p>Читать больше отзывов</p></a></div></div>
        <div className="row text-center">
          <div className="col-md-4 mb-5 mb-md-0"><div className="d-flex justify-content-center mb-4"></div><h5 className="mb-3">Наталья</h5><p className="px-xl-3"><i className="fas fa-quote-left pe-2"></i>Отдыхали в сентябре на базе отдыха  Фортуна. Действительно отдохнули. 3 отдельных домика со всеми удобствами. Можно забронировать все три домика, вместимость до 10 чел. Большой зелёный двор в цветах. До моря  7 минут размеренным шагом. Пляж- лучший на Черноморском побережье. Советуем</p><ul className="list-unstyled d-flex justify-content-center mb-0">{[1,2,3,4].map(i=><li key={i}><i className="fas fa-star fa-sm text-warning"></i></li>)}<li><i className="fas fa-star-half-alt fa-sm text-warning"></i></li></ul></div>
          <div className="col-md-4 mb-5 mb-md-0"><div className="d-flex justify-content-center mb-4"></div><h5 className="mb-3">Татьяна</h5><p className="px-xl-3"><i className="fas fa-quote-left pe-2"></i>Отдыхали у Фатимы в начале июля, остались очень довольны. Есть всё необходимое для комфортного отдыха. Хозяйка отзывчивая, гостеприимная женщина. Отдельно благодарны за то, что Фатима не оставила нас ночью с детьми на улице ждать времени заселения, а без проблем застелила нас ночью</p><ul className="list-unstyled d-flex justify-content-center mb-0">{[1,2,3,4,5].map(i=><li key={i}><i className="fas fa-star fa-sm text-warning"></i></li>)}</ul></div>
          <div className="col-md-4 mb-0"><div className="d-flex justify-content-center mb-4"></div><h5 className="mb-3">Ирина</h5><p className="px-xl-3"><i className="fas fa-quote-left pe-2"></i>Отдыхали в конце июня,все очень понравилось. Большой, ухоженный двор, три отдельных домика с удобствами, кондиционером, холодильником и телевизором, на крылечке стол и стулья, есть чайник для каждого домика и кухня для самостоятельного приготовления. Везде чистота, посуда хорошая и чистая, большая кровать с хорошим матрасом и подушками. До пляжа с соснами меньше 10мин. Фатима- доброжелательный и приятный человек, всегда на связи. Мы просто в восторге! Бронируйте, не пожалеете!!!</p><ul className="list-unstyled d-flex justify-content-center mb-0">{[1,2,3,4].map(i=><li key={i}><i className="fas fa-star fa-sm text-warning"></i></li>)}<li><i className="far fa-star fa-sm text-warning"></i></li></ul></div>
        </div></div>
      </section>
      <div id="part5"><div className="accordion" id="accordionExample"><div className="accordion-item"><h2 className="accordion-header"><button className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne">Цена за сутки</button></h2><div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample"><div className="accordion-body"><p>Предоплата равна суточному тарифу</p><p>Июнь: 3000<br/>Июль: 4000<br/>Август: 4000<br/>Сентябрь: 3500<br/>Октябрь: 2500<br/>Ноябрь: 1500</p></div></div></div><div className="accordion-item"><h2 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo">Ближайший город?</button></h2><div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample"><div className="accordion-body">Ближайший город - Пицунда располагается всего в 3 километрах</div></div></div><div className="accordion-item"><h2 className="accordion-header"><button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree">Возможны ли скидки?</button></h2><div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample"><div className="accordion-body">Скидки могут быть в индивидуальных случаях</div></div></div></div></div>
      <div id="part6">
        <h2>Мы на карте 🗺️</h2>
        <iframe title="Мы на карте — база отдыха Фортуна" src="https://yandex.ru/map-widget/v1/?um=constructor%3A46f5973efd8802ddb5e4ffa5dde2d03f742f3719ba4d530f516418b9e60baa9f&amp;source=constructor" width="100%" height="502" frameBorder="0" loading="lazy" />
      </div>
      {modal && (
        <><div className="modal-backdrop fade show" onClick={()=>setModal("")}></div>
        <div className="modal fade show d-block" id={modal === "booking" ? "modal1" : "modal2"} tabIndex={-1} aria-modal="true" role="dialog" onClick={(event)=>{if(event.target===event.currentTarget)setModal("")}}><div className={`modal-dialog ${modal === "question" ? "modal-dialog-centered" : ""}`}><div className="modal-content"><div className="modal-header"><h2 className="modal-title fs-5">{modal === "booking" ? "Бронирование" : "Задать вопрос"}</h2><button type="button" className="btn-close" aria-label="Close" onClick={()=>setModal("")}></button></div><div className="modal-body">{modal === "booking" ? <ContactForm close={()=>setModal("")}/> : <><p>Вы можете задать вопрос в любой момент позвонив или отправив сообщение </p><br/><p>📱 +7 (940) 991-61-61 Фатима (WhatsApp Telegram Max)</p><p><button id="number" type="button" onClick={()=>{if(navigator.clipboard)navigator.clipboard.writeText("+79409916161");setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="copy_number">{copied ? "Номер скопирован" : "Скопировать номер телефона"}</button></p></>}</div></div></div></div></>
      )}
    </main>
  );
}
