import asyncio
import websockets
import sys

async def bridge():
    uri = "ws://localhost:8000/ws/ingest"
    async with websockets.connect(uri) as websocket:
        print("=== HewaGuard Serial Bridge ===")
        print("Paste a line from Tinkercad Serial Monitor (or type 'exit')\n")
        while True:
            line = await asyncio.to_thread(sys.stdin.readline)
            line = line.strip()
            if not line:
                continue
            if line.lower() == "exit":
                break
            await websocket.send(line)
            response = await websocket.recv()
            print(f"Server: {response}")

if __name__ == "__main__":
    asyncio.run(bridge())