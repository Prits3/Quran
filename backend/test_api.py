import unittest
import requests

class TestAPI(unittest.TestCase):
    def test_health(self):
        response = requests.get('http://localhost:8000/health')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('verses', data)

    def test_recommend(self):
        response = requests.post('http://localhost:8000/recommend', json={'text': 'patience', 'k': 3})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('results', data)
        self.assertEqual(len(data['results']), 3)

if __name__ == '__main__':
    unittest.main()