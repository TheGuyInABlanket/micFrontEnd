from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing; restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)






data = [
    {
        'micnumber': '1',
        'ipaddress': '192.168.1.167',
        'tcpstatus': 'OFFLINE',
        'micstatus': 'Offline',
        'audiolevel': 0,
        'rflevel': 0,
        'antenna': 'NORF',
        'channame': ' ',
        'devid': ' ',
        'audiogain': ' ',
        'group': ' ',
        'channel': ' ',
        'frequency': '0',
        'batterybars': 0,
        'actors': [
            {'name': 'Jay', 'checked': False},
            {'name': 'Adam', 'checked': False}
        ]
    },
    {
        'micnumber': '2',
        'ipaddress': '192.168.1.190',
        'tcpstatus': 'ONLINE',
        'micstatus': 'Low Battery',
        'audiolevel': 42,
        'rflevel': 75,
        'antenna': 'B',
        'channame': 'RF 2',
        'devid': ' ',
        'audiogain': ' ',
        'group': '1',
        'channel': '66',
        'frequency': '0',
        'batterybars': 0,
        'actors': [
            {'name': 'Elise', 'checked': False},
            {'name': 'Sam', 'checked': False}
        ]
    },
    {
        'micnumber': '3',
        'ipaddress': '192.168.1.190',
        'tcpstatus': 'ONLINE',
        'micstatus': 'Good',
        'audiolevel': 42,
        'rflevel': 75,
        'antenna': 'B',
        'channame': 'RF 2',
        'devid': ' ',
        'audiogain': ' ',
        'group': '1',
        'channel': '66',
        'frequency': '0',
        'batterybars': 0,
        'actors': [
            {'name': 'Elise', 'checked': False},
            {'name': 'Sam', 'checked': False}
        ]
    }
]

@app.get("/test")
def get_test():
    return JSONResponse(content=data)
