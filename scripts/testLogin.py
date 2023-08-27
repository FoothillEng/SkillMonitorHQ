import requests

URL = "http://localhost:3000/api/login"

data = {
    "studentId": 98465
    
}

r = requests.post(url=URL, json=data)
print(r.status_code)
print(r.text)