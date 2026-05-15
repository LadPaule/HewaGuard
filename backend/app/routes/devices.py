from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.device_service import get_all_devices
from app.schemas.schemas import DeviceResponse

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("/", response_model=list[DeviceResponse])
async def list_devices(db: AsyncSession = Depends(get_db)):
    return await get_all_devices(db)