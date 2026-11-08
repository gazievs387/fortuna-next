import json
import os
import ssl
import smtplib
from email.message import EmailMessage

ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")
REQUIRED = ("date1", "date2", "phone_number")

def response(status, body):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": ALLOWED_ORIGIN, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}, "body": json.dumps(body, ensure_ascii=False)}

def handler(event, context):
    method = (event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method") or "").upper()
    if method == "OPTIONS":
        return response(204, {})
    if method != "POST":
        return response(405, {"error": "Method not allowed"})
    try:
        data = json.loads(event.get("body") or "{}")
    except (TypeError, json.JSONDecodeError):
        return response(400, {"error": "Invalid JSON"})
    if not isinstance(data, dict) or any(not str(data.get(key, "")).strip() for key in REQUIRED):
        return response(400, {"error": "date1, date2 and phone_number are required"})
    try:
        values = {key: str(data.get(key, "")).strip()[:2000] for key in ("date1", "date2", "phone_number", "email", "message")}
        message = EmailMessage()
        message["Subject"] = "Бронирование номера"
        message["From"] = os.environ["SMTP_FROM"]
        message["To"] = os.environ["BOOKING_TO"]
        message.set_content("\n".join(f"{key}: {value}" for key, value in values.items()))

        host = os.environ.get("SMTP_HOST", "smtp.mail.selcloud.ru")
        port = int(os.environ.get("SMTP_PORT", "1127"))
        username = os.environ["SMTP_USERNAME"]
        password = os.environ["SMTP_PASSWORD"]
        use_ssl = os.environ.get("SMTP_USE_SSL", "true").lower() in {"1", "true", "yes"}

        if use_ssl:
            smtp_connection = smtplib.SMTP_SSL(host, port, timeout=20, context=ssl.create_default_context())
        else:
            smtp_connection = smtplib.SMTP(host, port, timeout=20)

        with smtp_connection as smtp:
            if not use_ssl:
                smtp.starttls(context=ssl.create_default_context())
            smtp.login(os.environ["SMTP_USERNAME"], os.environ["SMTP_PASSWORD"])
            smtp.send_message(message)
    except Exception:
        return response(502, {"error": "Unable to send message"})
    return response(200, {"ok": True})
