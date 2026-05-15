from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc
from app.models.models import SensorData
from app.models.models import Device
from app.schemas.schemas import SensorDataCreate
from app.services.device_service import get_or_create_device
from typing import Optional

async def create_sensor_data(db: AsyncSession, data: SensorDataCreate) -> SensorData:
    device = await get_or_create_device(db, data.device_id)
    sensor_data = SensorData(
        device_id=device.id,
        timestamp=data.timestamp,
        gas_value=data.gas_value,
        temperature=data.temperature,
        status=data.status
    )
    db.add(sensor_data)
    await db.commit()
    await db.refresh(sensor_data)
    return sensor_data

async def get_latest_readings(db: AsyncSession, limit: int = 10):
    query = select(SensorData).order_by(desc(SensorData.timestamp)).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def get_sensor_history(
    db: AsyncSession,
    device_id: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None
):
    query = select(SensorData).join(Device)
    if device_id:
        query = query.where(Device.device_id == device_id)
    if start:
        query = query.where(SensorData.timestamp >= start)
    if end:
        query = query.where(SensorData.timestamp <= end)
    query = query.order_by(SensorData.timestamp)
    result = await db.execute(query)
    return result.scalars().all()