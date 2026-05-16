import requests

LOGIN_URL = 'http://localhost:8000/api/accounts/login/'
BRANCHES_URL = 'http://localhost:8000/api/inventory/branches/'

creds = {'email':'admin@bravoos.az','password':'BravoOS@2024!'}
try:
    r = requests.post(LOGIN_URL, json=creds)
    r.raise_for_status()
    data = r.json()
    token = data.get('access')
    print('Logged in, token length:', len(token) if token else 'none')
    h = {'Authorization': f'Bearer {token}'}
    b = requests.get(BRANCHES_URL, headers=h)
    print('Branches status:', b.status_code)
    print(b.json())
except Exception as e:
    print('Error:', e)
