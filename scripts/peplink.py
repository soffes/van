#!/usr/bin/python3

import requests
import json

# I couldn't figure out how to send the secrets in the command_line sensor. If
# you get get local access to my network, you are welcome to use this readonly
# user to query things about my router. You earned it.
host = '10.0.0.1'
credentials = {
    'username': 'readonly',
    'password': 'xfXWBiDRoVf8MLE4mkXsgmUeHGRJQdir'
}

session = requests.Session()

# Disable verifying the router's self-signed cert
session.verify = False
requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)

# Login
session.post(f'https://{host}/api/login', params=credentials)
response = session.get(f'https://{host}/api/info.location')

# Get the location
location = response.json()['response']['location']
output = {
    'latitude': location['latitude'],
    'longitude': location['longitude']
}
print(json.dumps(output))
