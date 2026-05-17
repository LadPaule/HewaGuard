from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.services.sensor_service import get_latest_readings, get_sensor_history
from app.schemas.schemas import SensorDataResponse

router = APIRouter(prefix="/sensor-data", tags=["sensor-data"])

@router.get("/latest", response_model=list[SensorDataResponse])
async def latest_readings(limit: int = 20, db: AsyncSession = Depends(get_db)):
    return await get_latest_readings(db, limit)

@router.get("/history", response_model=list[SensorDataResponse])
async def sensor_history(
    device_id: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await get_sensor_history(db, device_id=device_id, start=start, end=end)
