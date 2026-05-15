from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from app.models.models import SensorData
from app.models.models import Device

async def average_by_hour(db: AsyncSession):
    query = select(
        extract('hour', SensorData.timestamp).label('hour'),
        func.avg(SensorData.gas_value).label('avg_gas')
    ).group_by('hour').order_by('hour')
    result = await db.execute(query)
    return [{"hour": r.hour, "avg_gas": float(r.avg_gas)} for r in result]

async def peak_pollution_times(db: AsyncSession, threshold=70):
    query = select(SensorData).where(
        SensorData.gas_value >= threshold
    ).order_by(SensorData.gas_value.desc()).limit(10)
    result = await db.execute(query)
    return result.scalars().all()

async def most_affected_locations(db: AsyncSession):
    query = select(
        Device.location,
        func.avg(SensorData.gas_value).label('avg_gas')
    ).join(SensorData).group_by(Device.location).order_by(func.avg(SensorData.gas_value).desc())
    result = await db.execute(query)
    return [{"location": r.location, "avg_gas": float(r.avg_gas)} for r in result]