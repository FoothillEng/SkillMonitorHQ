import requests

URL = "http://localhost:3000/api/createStudent"

data = {
    "id": "John Doe",
    "profilePath": "https://www.google.com",
}

r = requests.post(url=URL, json=data)
print(r.status_code)
print(r.text)