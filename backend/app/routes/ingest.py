from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.schemas import SensorDataCreate, SensorDataResponse
from app.services.sensor_service import create_sensor_data
from app.services.alert_service import create_alert as create_alert_service
from app.models.models import StatusEnum

router = APIRouter(tags=["ingest"])

@router.post("/sensor-data", response_model=SensorDataResponse, status_code=status.HTTP_201_CREATED)
async def ingest_sensor_data(payload: SensorDataCreate, db: AsyncSession = Depends(get_db)):
    sensor_data = await create_sensor_data(db, payload)
    
    if payload.status == StatusEnum.DANGEROUS:
        
        await create_alert_service(db, sensor_data)
    return sensor_data