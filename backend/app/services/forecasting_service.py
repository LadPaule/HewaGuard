import pandas as pd
from prophet import Prophet
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.models import SensorData, Device
from datetime import datetime, timedelta, timezone

async def forecast_device(db: AsyncSession, device_id: str, days: int = 1):
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=7)
    
    # Fetch last 7 days of data
    query = (
        select(SensorData.timestamp, SensorData.gas_value)
        .join(Device)
        .where(
            and_(
                Device.device_id == device_id,
                SensorData.timestamp >= start_date,
            )
        )
        .order_by(SensorData.timestamp)
    )
    result = await db.execute(query)
    rows = result.all()
    
    if len(rows) < 10:
        raise ValueError("Not enough data to forecast")
    

    df = pd.DataFrame(rows, columns=["ds", "y"])
    df["ds"] = pd.to_datetime(df["ds"]).dt.tz_localize(None) 
    
    # Fit Prophet model
    model = Prophet()
    model.fit(df)
    

    future = model.make_future_dataframe(periods=days * 24, freq='h')
    forecast = model.predict(future)
    
    # Extract needed columns
    forecast_data = (
        forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]
        .tail(days * 24)
        .to_dict(orient="records")
    )
    
    # Convert timestamps to ISO strings for JSON
    for rec in forecast_data:
        rec["ds"] = rec["ds"].isoformat()
    
    return forecast_data