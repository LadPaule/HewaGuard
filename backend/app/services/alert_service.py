import smtplib
from email.message import EmailMessage
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Alert
from app.core.config import settings

async def create_alert(db: AsyncSession, sensor_data) -> Alert:
    alert = Alert(
        device_id=sensor_data.device_id,
        sensor_data_id=sensor_data.id,
        message=f"DANGEROUS gas level {sensor_data.gas_value} at {sensor_data.timestamp}"
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    # Send email asynchronously (use background task in route)
    try:
        await send_email_alert(sensor_data.device.device_id, sensor_data.gas_value)
    except Exception as e:
        print(f"Email failed: {e}")
    return alert

async def send_email_alert(device_id: str, gas_value: float):
    msg = EmailMessage()
    msg.set_content(f"ALERT: Device {device_id} reported dangerous gas level {gas_value} ppm")
    msg["Subject"] = "HewaGuard Danger Alert"
    msg["From"] = "noreply@hewaguard.ug"
    msg["To"] = "alerts@hewaguard.ug"
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)

async def get_alerts(db: AsyncSession, limit: int = 50):
    from sqlalchemy import select, desc
    query = select(Alert).order_by(desc(Alert.created_at)).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()