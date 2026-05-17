from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import async_session
from app.services.sensor_service import create_sensor_data
from app.services.alert_service import create_alert as create_alert_service
from app.schemas.schemas import SensorDataCreate
from app.models.models import StatusEnum
from datetime import datetime, timezone
import logging

router = APIRouter()
logger = logging.getLogger("ws_ingest")

@router.websocket("/ws/ingest")
async def websocket_ingest(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket client connected")
    try:
        while True:
            raw_data = await websocket.receive_text()
            logger.debug(f"Received: {raw_data}")

            
            parts = raw_data.strip().split(",")
            if len(parts) != 5:
                await websocket.send_text("ERROR: Expected 5 fields (DEVICE_ID,millis,gas,temp,status)")
                continue

            device_id, millis_str, gas_str, temp_str, status_str = parts

            try:
                
                timestamp = datetime.now(timezone.utc)
                gas_value = float(gas_str)          
                temperature = float(temp_str)
                status = StatusEnum(status_str.strip())
            except (ValueError, KeyError) as e:
                await websocket.send_text(f"ERROR: Invalid data format: {e}")
                continue

            sensor_create = SensorDataCreate(
                device_id=device_id.strip(),
                timestamp=timestamp,
                gas_value=gas_value,
                temperature=temperature,
                status=status,
            )

            async with async_session() as db:
                try:
                    sensor_data = await create_sensor_data(db, sensor_create)
                    if status == StatusEnum.DANGEROUS:
                        await create_alert_service(db, sensor_data)
                    await db.commit()
                    await websocket.send_text(f"OK: stored id={sensor_data.id}")
                except Exception as e:
                    logger.error(f"DB error: {e}")
                    await websocket.send_text(f"ERROR: Database failure: {str(e)}")

    except WebSocketDisconnect:
        logger.info("Client disconnected")