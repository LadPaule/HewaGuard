from sqlalchemy  import Column, Integer,Boolean, String, func, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class StatusEnum(str, enum.Enum):
    SAFE = "SAFE"
    MODERATE = "MODERATE"
    DANGEROUS = "DANGEROUS"
class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(50), unique=True, index=True, nullable=False)
    location = Column(String(100), nullable=False)
    installed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    sensor_data = relationship("SensorData", back_populates="device")
    alerts = relationship("Alert", back_populates="device")


class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    gas_value = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False)
    device = relationship("Device", back_populates="sensor_data")
    alert = relationship("Alert", back_populates="sensor_data", uselist=False)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    sensor_data_id = Column(Integer, ForeignKey("sensor_data.id"), unique=True)
    message = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
    resolved = Column(Boolean, default=False)
    device = relationship("Device", back_populates="alerts")
    sensor_data = relationship("SensorData", back_populates="alert")

