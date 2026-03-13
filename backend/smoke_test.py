import requests

# Simple smoke test
response = requests.get('http://localhost:8000/health')
if response.status_code == 200:
    data = response.json()
    print('Smoke test passed! Verses:', data['verses'])
else:
    print('Smoke test failed!')