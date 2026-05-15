import os
import sys
import asyncio
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from sqlalchemy.ext.asyncio import AsyncEngine
from alembic import context
from dotenv import load_dotenv


sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
load_dotenv()

from app.core.database import Base
from app.models.models import Device, SensorData, Alert  

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    url = os.getenv("DATABASE_URL")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online_async():
    """Async version of run_migrations_online."""
    from app.core.database import engine

  
    if not isinstance(engine, AsyncEngine):
        raise TypeError("Engine must be an AsyncEngine")

    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Wrapper to run async migrations."""
    asyncio.run(run_migrations_online_async())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

    