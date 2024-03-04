import subprocess
import pytube
import re
import json
import os
import datetime

def generate_date():
    return datetime.datetime.now().strftime("%d%m%Y_%H%M%S")

def download_video(url):

    video = pytube.YouTube(url)
    title = re.sub(r'[^a-zA-Z0-9_\s]', '', video.title.replace(" ","_")) + "_" + generate_date()

    dump_files = os.listdir('dumps')
    if not (f"{title}_audio.mp3" in dump_files and f"{title}_video.mp4" in dump_files):
        print(f"Start downloading {title}...")
        with open('dumps/download.json','w') as f:f.write(json.dumps({"url":url,"title":title}))
        subprocess.call("ts-node modules/downloader.ts", shell=True)

    subprocess.call(f"sh modules/merger.sh dumps/{title}_audio.mp3 dumps/{title}_video.mp4 videos/{title}.mp4", shell=True)
    print(f"Command: sh modules/merger.sh dumps/{title}_audio.mp3 dumps/{title}_video.mp4 videos/{title}.mp4")
    print(f"Downloaded {title}!")

# https://www.youtube.com/watch?v=Ck3qRdkoMbg
url = input("Enter youtube url: ")
download_video(url)
