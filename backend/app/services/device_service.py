from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Device

async def get_or_create_device(db: AsyncSession, device_id: str) -> Device:
    result = await db.execute(select(Device).where(Device.device_id == device_id))
    device = result.scalar_one_or_none()

    if not device:
        device = Device(device_id=device_id, location="Unknown")
        db.add(device)
        await db.commit()
        await db.refresh(device)
    return device

async def get_all_devices(db: AsyncSession):
    result = await db.execute(select(Device))
    return result.scalars().all()