import requests
import csv
import io
import os

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
BUCKET = "bcnbustime"
FILENAME = "stops.csv"

response = requests.get("https://developer.tmb.cat/downloads/parades.csv")
if(response.status_code != 200):
    print(f"ERROR DOWNLOADING CSV {response.status_code}: {response.text}")

csv_data = response.content

upload_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{FILENAME}"
headers = {
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "text/csv",
    "x-upsert": "true"
}
upload = requests.put(upload_url, data=csv_data, headers=headers)

if(upload.status_code < 300):
    print("CSV Uploaded correctly")
else: 
    print(f"ERROR UPLOADING FILE {upload.status_code}: {upload.text}")