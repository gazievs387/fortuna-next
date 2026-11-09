const nodemailer = require("nodemailer");

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
const requiredFields = ["date1", "date2", "phone_number"];

function response(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify(payload),
  };
}

function requestMethod(event) {
  return (
    event.httpMethod ||
    event.requestContext?.http?.method ||
    event.method ||
    ""
  ).toUpperCase();
}

function parseBody(event) {
  let body = event.body || "{}";
  if (event.isBase64Encoded) body = Buffer.from(body, "base64").toString("utf8");
  return JSON.parse(body);
}

function formatRussianDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return value;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function smtpTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "gazievs387@gmail.com",
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
}

module.exports.handler = async function handler(event) {
  const method = requestMethod(event);
  if (method === "OPTIONS") return response(204, {});
  if (method !== "POST") return response(405, { error: "Method not allowed" });

  let data;
  try {
    data = parseBody(event);
  } catch {
    return response(400, { error: "Invalid JSON" });
  }

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    requiredFields.some((field) => !String(data[field] || "").trim())
  ) {
    return response(400, {
      error: "date1, date2 and phone_number are required",
    });
  }

  const values = Object.fromEntries(
    ["date1", "date2", "phone_number", "email", "message"].map((field) => [
      field,
      String(data[field] || "").trim().slice(0, 2000),
    ]),
  );
  values.date1 = formatRussianDate(values.date1);
  values.date2 = formatRussianDate(values.date2);

try {
  const transporter = smtpTransport();

  await transporter.sendMail({
    from: "gazievs387@gmail.com",
    to: "gazievs387@gmail.com",
    subject: "Фортуна Бронирование номера",
    text: Object.entries(values)
        .map(([field, value]) => {
          const labels = {
            date1: "Дата заезда",
            date2: "Дата отъезда",
            phone_number: "Номер телефона",
            email: "Email",
            message: "Сообщение",
          };
          return `${labels[field] || field}: ${value}`;
        })
      .join("\n"),
  });

} catch {
  return response(502, {
    error: "Unable to send message",
  });
}

  return response(200, { ok: true });
};
