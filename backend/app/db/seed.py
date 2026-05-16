import asyncio
from sqlalchemy import select
from app.core.database import async_session
from app.models.models import Device

KNOWN_DEVICES = [
    {"device_id": "HG-UNI-01", "location": "Cavendish University Uganda"},
    {"device_id": "HG-HM-01", "location": "Ak Home"},
    {"device_id": "HG-PK-01", "location": "New Taxi Park"},
    {"device_id": "HG-MKT-01", "location": "Owino Market"},
]

async def seed_devices():
    async with async_session() as db:
        for dev in KNOWN_DEVICES:
            #Todo: Check if device already exists
            result = await db.execute(
                select(Device).where(Device.device_id == dev["device_id"])
            )
            if not result.scalar_one_or_none():
                db.add(Device(device_id = dev["device_id"], location = dev["location"]))
        await db.commit()
        print("Devices seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_devices())