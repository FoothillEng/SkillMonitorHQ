import requests

URL = "http://localhost:3000/api/createStudent"

data = {
    "studentId": 2222,
}

r = requests.post(url=URL, json=data, timeout=5)
print(r.status_code)
print(r.text)
