import socketio
import uvicorn

sio = socketio.AsyncServer(async_mode='asgi')
app = socketio.ASGIApp(sio, static_files={
    '/': 'public/index.html',
    '/lib': 'public/lib',
})

@sio.event
async def connect(sid, environ):
    print('Client connected')

@sio.event
async def message(sid, data):
    print('Received from client:', data)
    await sio.emit('message', data, to=sid)

@sio.event
async def disconnect(sid, reason=None):
    print('Client disconnected')

if __name__ == '__main__':
    uvicorn.run(app, host='localhost', port=3000)