from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.analytics_service import average_by_hour, peak_pollution_times, most_affected_locations

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/avg-by-hour")
async def avg_by_hour(db: AsyncSession = Depends(get_db)):
    return await average_by_hour(db)

@router.get("/peak-times")
async def peak_times(threshold: float = 70, db: AsyncSession = Depends(get_db)):
    return await peak_pollution_times(db, threshold)

@router.get("/affected-locations")
async def affected_locations(db: AsyncSession = Depends(get_db)):
    return await most_affected_locations(db)