import asyncio
import websockets
import json
import logging
import random
import os
import time
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Todo: Configuration
WS_URL = os.getenv("WS_URL", "ws://localhost:8000/ws/ingest")
INTERVAL = int(os.getenv("INTERVAL_SECONDS", "60"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("simulator")

# Todo: Device definitions: base gas, base temp, location
DEVICES = [
    {"id": "HG-PK-01", "base_gas": 200, "base_temp": 26.0, "gas_offset": 250, "temp_offset": 3.6},
    {"id": "HG-MKT-01", "base_gas": 400, "base_temp": 29.0, "gas_offset": 400, "temp_offset": 1.8},
    {"id": "HG-UNI-01", "base_gas": 550, "base_temp": 24.0, "gas_offset": 50, "temp_offset": -5.0},
    {"id": "HG-HM-01", "base_gas": 700, "base_temp": 31.0, "gas_offset": -75, "temp_offset": -2.5},
]

def classify_status(gas_value):
    if gas_value < 300:
        return "SAFE"
    elif gas_value < 600:
        return "MODERATE"
    else:
        return "DANGEROUS"

def generate_reading(device):
    # Simulate analogRead with base value, offset, and jitter
    gas_raw = device["base_gas"] + device["gas_offset"] + random.randint(-3, 3)
    gas = max(0, gas_raw)  # ensure non-negative


    temp = device["base_temp"] + random.uniform(-2.0, 2.0)
    temp = round(temp, 1)

    status = classify_status(gas)

    # Todo: Generate millis-like timestamp (current UTC milliseconds)
    millis = int(datetime.now(timezone.utc).timestamp() * 1000)

    return f"{device['id']},{millis},{gas},{temp},{status}"

async def send_readings():
    while True:
        try:
            async with websockets.connect(WS_URL) as ws:
                logger.info(f"Connected to {WS_URL}")
                while True:
                    for device in DEVICES:
                        payload = generate_reading(device)
                        await ws.send(payload)
                        response = await ws.recv()
                        logger.info(f"{device['id']} -> {payload} | Server: {response}")
                    await asyncio.sleep(INTERVAL)
        except (websockets.ConnectionClosed, OSError) as e:
            logger.error(f"Connection lost: {e}. Reconnecting in 10 seconds...")
            await asyncio.sleep(10)
        except Exception as e:
            logger.exception(f"Unexpected error: {e}")
            await asyncio.sleep(10)

if __name__ == "__main__":
    logger.info(f"Starting HewaGuard device simulator. WS endpoint: {WS_URL}, interval: {INTERVAL}s")
    asyncio.run(send_readings())

    