from fastapi import FastAPI
from fastapi.responses import JSONResponse, Response
import json
import ast
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
        'showTag': 'Frozen',
        'ipaddress': '192.168.1.167',
        'tcpstatus': 'OFFLINE',
        'micstatus': 'Offline',
        'operationalstatus': "audiolive", 
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
        'operationalstatus': "overdrive", 
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
        'operationalstatus': "noaudiolive", 
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

data2 = "[{'micnumber': '1', 'ipaddress': '192.168.1.167', 'tcpstatus': 'OFFLINE', 'micstatus': 'Good', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': [{'name': 'Tim', 'checked': False}]}, {'micnumber': '2', 'ipaddress': '192.168.1.190', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 7, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': [{'name': 'Jane', 'checked': False}]}, {'micnumber': '3', 'ipaddress': '192.168.1.103', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 4, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': [{'name': 'Jonah', 'checked': False}]}, {'micnumber': '4', 'ipaddress': '192.168.1.104', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 5, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': [{'name': 'James', 'checked': False}, {'name': 'Jona', 'checked': False}]}, {'micnumber': '5', 'ipaddress': '192.168.1.105', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 1, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': [{'name': 'Ann', 'checked': False}, {'name': 'Mary', 'checked': False}]}, {'micnumber': '6', 'ipaddress': '192.168.1.106', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '7', 'ipaddress': '192.168.1.107', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '8', 'ipaddress': '192.168.1.108', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '9', 'ipaddress': '192.168.1.109', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '10', 'ipaddress': '192.168.1.110', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '11', 'ipaddress': '192.168.1.111', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '12', 'ipaddress': '192.168.1.112', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '13', 'ipaddress': '192.168.1.113', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '14', 'ipaddress': '192.168.1.114', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '15', 'ipaddress': '192.168.1.115', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '16', 'ipaddress': '192.168.1.116', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '17', 'ipaddress': '192.168.1.117', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '18', 'ipaddress': '192.168.1.118', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '19', 'ipaddress': '192.168.1.119', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '20', 'ipaddress': '192.168.1.120', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '21', 'ipaddress': '192.168.1.121', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '22', 'ipaddress': '192.168.1.122', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '23', 'ipaddress': '192.168.1.123', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '24', 'ipaddress': '192.168.1.124', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '25', 'ipaddress': '192.168.1.125', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '26', 'ipaddress': '192.168.1.126', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '27', 'ipaddress': '192.168.1.127', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '28', 'ipaddress': '192.168.1.128', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '29', 'ipaddress': '192.168.1.129', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}, {'micnumber': '30', 'ipaddress': '192.168.1.130', 'tcpstatus': 'OFFLINE', 'micstatus': 'Offline', 'opstatus': 0, 'audiolevel': 0, 'rflevel': 0, 'antenna': 'NORF', 'channame': ' ', 'devid': ' ', 'audiogain': ' ', 'group': ' ', 'channel': ' ', 'frequency': '0', 'batterybars': 0, 'checkstatus': False, 'actors': []}]"
data3 = "[{'activeshownumber': '3', 'activeshowname': 'Frozen Jr', 'shows': [{'shownumber': '1', 'showname': 'Frozen', 'cast': [{'micnumber': '1', 'actors': ['Jay', 'Adam']}, {'micnumber': '2', 'actors': ['Elise', 'Sam']}, {'micnumber': '3', 'actors': ['Caleb']}, {'micnumber': '4', 'actors': ['Henry']}, {'micnumber': '5', 'actors': ['Abigail']}, {'micnumber': '6', 'actors': ['Anabelle']}, {'micnumber': '7', 'actors': ['Heidi']}, {'micnumber': '8', 'actors': ['Alyona']}, {'micnumber': '9', 'actors': ['Jonah']}, {'micnumber': '10', 'actors': ['Graelyn']}, {'micnumber': '11', 'actors': ['Beatrice']}, {'micnumber': '12', 'actors': ['Harley Quinn']}, {'micnumber': '13', 'actors': ['Gunnar', 'Kyla']}, {'micnumber': '14', 'actors': ['Reagan']}, {'micnumber': '15', 'actors': ['Sophia']}, {'micnumber': '16', 'actors': ['Chelsea', 'Sydney']}, {'micnumber': '17', 'actors': ['Elliot', 'Logan']}, {'micnumber': '18', 'actors': ['Luke', 'Oaklee']}, {'micnumber': '19', 'actors': ['Lauryn']}, {'micnumber': '20', 'actors': ['Marley']}, {'micnumber': '21', 'actors': ['Lea']}, {'micnumber': '22', 'actors': ['Gigi']}, {'micnumber': '23', 'actors': ['Drea']}, {'micnumber': '24', 'actors': ['Gracie']}, {'micnumber': '25', 'actors': ['Norah', 'Lincoln']}, {'micnumber': '26', 'actors': ['Lucia', 'Jensen']}, {'micnumber': '27', 'actors': ['Rose', 'Ever']}, {'micnumber': '28', 'actors': ['Adalyn', 'Hannah']}, {'micnumber': '29', 'actors': []}, {'micnumber': '30', 'actors': []}, {'micnumber': '31', 'actors': []}, {'micnumber': '32', 'actors': []}]}, {'shownumber': '2', 'showname': 'Wizard of Oz', 'cast': [{'micnumber': '1', 'actors': ['Tim']}, {'micnumber': '2', 'actors': ['Jane']}, {'micnumber': '3', 'actors': ['Jonah']}, {'micnumber': '4', 'actors': ['James', 'Jona']}, {'micnumber': '5', 'actors': ['Ann', 'Mary']}, {'micnumber': '6', 'actors': []}, {'micnumber': '7', 'actors': []}, {'micnumber': '8', 'actors': []}, {'micnumber': '9', 'actors': []}, {'micnumber': '10', 'actors': []}, {'micnumber': '11', 'actors': []}, {'micnumber': '12', 'actors': []}, {'micnumber': '13', 'actors': []}, {'micnumber': '14', 'actors': []}, {'micnumber': '15', 'actors': []}, {'micnumber': '16', 'actors': []}, {'micnumber': '17', 'actors': []}, {'micnumber': '18', 'actors': []}, {'micnumber': '19', 'actors': []}, {'micnumber': '20', 'actors': []}, {'micnumber': '21', 'actors': []}, {'micnumber': '22', 'actors': []}, {'micnumber': '23', 'actors': []}, {'micnumber': '24', 'actors': []}, {'micnumber': '25', 'actors': []}, {'micnumber': '26', 'actors': []}, {'micnumber': '27', 'actors': []}, {'micnumber': '28', 'actors': []}, {'micnumber': '29', 'actors': []}, {'micnumber': '30', 'actors': []}, {'micnumber': '31', 'actors': []}, {'micnumber': '32', 'actors': []}]}, {'shownumber': '3', 'showname': 'Magic Treehouse', 'cast': [{'micnumber': '1', 'actors': ['Olive']}, {'micnumber': '2', 'actors': ['Jim']}, {'micnumber': '3', 'actors': ['Jackson', 'Michelle']}, {'micnumber': '4', 'actors': ['Eddy', 'MikeG', 'Jensen', 'Jona']}, {'micnumber': '5', 'actors': ['MikeM', 'Jack']}, {'micnumber': '6', 'actors': ['Mickey']}, {'micnumber': '7', 'actors': ['Donald']}, {'micnumber': '8', 'actors': []}, {'micnumber': '9', 'actors': ['Daisy']}, {'micnumber': '10', 'actors': []}, {'micnumber': '11', 'actors': []}, {'micnumber': '12', 'actors': []}, {'micnumber': '13', 'actors': []}, {'micnumber': '14', 'actors': []}, {'micnumber': '15', 'actors': []}, {'micnumber': '16', 'actors': []}, {'micnumber': '17', 'actors': []}, {'micnumber': '18', 'actors': []}, {'micnumber': '19', 'actors': []}, {'micnumber': '20', 'actors': []}, {'micnumber': '21', 'actors': []}, {'micnumber': '22', 'actors': []}, {'micnumber': '23', 'actors': []}, {'micnumber': '24', 'actors': []}, {'micnumber': '25', 'actors': []}, {'micnumber': '26', 'actors': []}, {'micnumber': '27', 'actors': []}, {'micnumber': '28', 'actors': []}, {'micnumber': '29', 'actors': []}, {'micnumber': '30', 'actors': ['Jenny']}, {'micnumber': '31', 'actors': ['Jasper']}, {'micnumber': '32', 'actors': ['Lake']}]}, {'shownumber': '4', 'showname': 'Frozen Jr', 'cast': [{'micnumber': '1', 'actors': ['Sam']}, {'micnumber': '2', 'actors': ['Debbie']}, {'micnumber': '3', 'actors': ['Jake']}, {'micnumber': '4', 'actors': ['Linda']}, {'micnumber': '5', 'actors': ['Alice', 'Andrew', 'Jane', 'Bob']}, {'micnumber': '6', 'actors': ['Jean']}, {'micnumber': '7', 'actors': []}, {'micnumber': '8', 'actors': []}, {'micnumber': '9', 'actors': []}, {'micnumber': '10', 'actors': []}, {'micnumber': '11', 'actors': []}, {'micnumber': '12', 'actors': []}, {'micnumber': '13', 'actors': []}, {'micnumber': '14', 'actors': []}, {'micnumber': '15', 'actors': []}, {'micnumber': '16', 'actors': []}, {'micnumber': '17', 'actors': []}, {'micnumber': '18', 'actors': []}, {'micnumber': '19', 'actors': []}, {'micnumber': '20', 'actors': []}, {'micnumber': '21', 'actors': []}, {'micnumber': '22', 'actors': []}, {'micnumber': '23', 'actors': []}, {'micnumber': '24', 'actors': []}, {'micnumber': '25', 'actors': []}, {'micnumber': '26', 'actors': []}, {'micnumber': '27', 'actors': []}, {'micnumber': '28', 'actors': []}, {'micnumber': '29', 'actors': []}, {'micnumber': '30', 'actors': []}, {'micnumber': '31', 'actors': []}, {'micnumber': '32', 'actors': []}]}]}]"

@app.get("/test")
def get_test():
    #return JSONResponse(content=data2)
    py_obj = ast.literal_eval(data2)
    data2_json_str = json.dumps(py_obj)
    return Response(content=data2_json_str, media_type="application/json")

@app.get("/title")
def get_title():
    py_obj = ast.literal_eval(data3)
    data2_json_str = json.dumps(py_obj)
    return Response(content=data2_json_str, media_type="application/json")
