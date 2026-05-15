from pydantic import BaseModel, Field
from datetime import datetime, UTC
from app.models.models import StatusEnum

class SensorDataCreate(BaseModel):
    device_id: str
    timestamp: datetime = Field(default_factory=datetime.now(UTC))
    gas_value: float
    temperature: float
    status: StatusEnum

class SensorDataResponse(BaseModel):
    id: int
    device_id: int  # will be overridden in route to return string
    timestamp: datetime
    gas_value: float
    temperature: float
    status: StatusEnum

    class Config:
        from_attributes = True

class DeviceResponse(BaseModel):
    id: int
    device_id: str
    location: str
    installed_at: datetime

    class Config:
        from_attributes = True


class AlertResponse(BaseModel):
    id: int
    device_id: int
    sensor_data_id: int
    message: str
    created_at: datetime
    resolved: bool

    class Config:
        from_attributes = True