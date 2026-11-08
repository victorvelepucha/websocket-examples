import asyncio
import websockets

async def handler(websocket):
    print("Client connected")
    async for message in websocket:
        print("Received from client:", message)
        await websocket.send(message)
    print("Client disconnected")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 3000):
        print("Server running at ws://localhost:3000")
        await asyncio.Future()  # runs forever

asyncio.run(main())