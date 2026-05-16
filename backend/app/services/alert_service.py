import smtplib
import asyncio
from email.message import EmailMessage
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Alert
from app.core.config import settings
import logging

logger = logging.getLogger("alert_service")

async def create_alert(db: AsyncSession, sensor_data) -> Alert:
    alert = Alert(
        device_id=sensor_data.device_id,
        sensor_data_id=sensor_data.id,
        message=f"DANGEROUS gas level {sensor_data.gas_value} at {sensor_data.timestamp}"
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    

    asyncio.create_task(send_email_alert_async(
        sensor_data.device.device_id, 
        sensor_data.gas_value
    ))
    return alert

async def send_email_alert_async(device_id: str, gas_value: float):
    """Send email alert in a thread to avoid blocking the async loop."""
    try:
        await asyncio.to_thread(send_email_sync, device_id, gas_value)
    except Exception as e:
        logger.error(f"Email alert failed: {e}")

def send_email_sync(device_id: str, gas_value: float):
    """Blocking email send, meant to be run in a thread."""
    if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.SMTP_PASS]):
        logger.warning("SMTP not configured, skipping email alert")
        return
    
    msg = EmailMessage()
    msg.set_content(f"ALERT: Device {device_id} reported dangerous gas level {gas_value} ppm")
    msg["Subject"] = "HewaGuard Danger Alert"
    msg["From"] = "noreply@hewaguard.ug"
    msg["To"] = "alerts@hewaguard.ug"
    
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)
    
    logger.info(f"Email alert sent for device {device_id}")

async def get_alerts(db: AsyncSession, limit: int = 50):
    from sqlalchemy import select, desc
    query = select(Alert).order_by(desc(Alert.created_at)).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
