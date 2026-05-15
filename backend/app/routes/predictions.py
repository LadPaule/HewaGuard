from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.forecasting_service import forecast_device

router = APIRouter(prefix="/predictions", tags=["predictions"])

@router.get("/{device_id}")
async def predict(device_id: str, days: int = 1, db: AsyncSession = Depends(get_db)):
    try:
        forecast = await forecast_device(db, device_id, days)
        return forecast
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))