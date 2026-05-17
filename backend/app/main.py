from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routes import ingest, devices, analytics, predictions, alerts, ws_ingest, sensor_data

# Create tables at startup (not for production; use Alembic)
# Instead, we can use lifespan event for dev convenience
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # In production, run migrations, not create_all
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="HewaGuard API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ingest.router, prefix=settings.API_V1_PREFIX)
app.include_router(devices.router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX)
app.include_router(predictions.router, prefix=settings.API_V1_PREFIX)
app.include_router(alerts.router, prefix=settings.API_V1_PREFIX)
app.include_router(ws_ingest.router)
app.include_router(sensor_data.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {"message": "HewaGuard API is running"}


