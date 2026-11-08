import asyncio
import websockets

async def client():
    async with websockets.connect("ws://localhost:3000") as websocket:
        await websocket.send("Python client say hello!")
        response = await websocket.recv()
        print("Server replied: ", response)

asyncio.run(client())