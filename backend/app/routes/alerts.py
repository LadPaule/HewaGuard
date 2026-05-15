from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.alert_service import get_alerts
from app.schemas.schemas import AlertResponse

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=list[AlertResponse])
async def list_alerts(limit: int = 50, db: AsyncSession = Depends(get_db)):
    return await get_alerts(db, limit)