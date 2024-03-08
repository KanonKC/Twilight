import subprocess
import pytube
import re
import json
import os
import datetime

# สักวันจะได้ใช้
# th = u'[ก-ฮ]+'

def convertToSeconds(time):
    time = time.split(":")
    if len(time) == 3:
        return int(time[0]) * 3600 + int(time[1]) * 60 + int(time[2])
    elif len(time) == 2:
        return int(time[0]) * 60 + int(time[1])
    else:
        return int(time[0])

def generate_date():
    return datetime.datetime.now().strftime("%d%m%Y_%H%M%S")

def download_video(url,start=0,end=-1):

    video = pytube.YouTube(url)
    title = video.title.replace(" ","_").replace("|","_") #re.sub(r'[^a-zA-Z0-9_\s]', '', video.title.replace(" ","_")) 
    title_time = title + "_" + generate_date()

    dump_files = os.listdir('downloads')

    with open('downloads/download.json','w') as f:f.write(json.dumps({
        "url":url,
        "title":title,
        "start": start,
        "end": end if end != -1 else -1
    }))

    if not (f"{title}_audio.mp3" in dump_files and f"{title}_video.mp4" in dump_files):
        print(f"Start downloading {title}...")  
        subprocess.call("ts-node modules/downloader.ts", shell=True)

    merge_command = f"sh modules/merger.sh downloads/{title}_audio.mp3 downloads/{title}_video.mp4 videos/{title}.mp4"

    subprocess.call(merge_command, shell=True)
    print(f"Command: {merge_command}")
    print(f"Downloaded {title}!")

    if start != 0 and end != -1:
        print(f"Trimming {title}...")
        print(f"Start: {start}, End: {end}")
        subprocess.call(f"python modules/trimmer.py", shell=True)

# https://www.youtube.com/watch?v=Ck3qRdkoMbg
# url = input("Enter youtube url: ")
# download_video(url, convertToSeconds("0:05"), convertToSeconds("0:10"))

def main():
    request = json.load(open('tickets/download/ticket.json'))['youtube']

    for video in request:
        if len(video['highlight']) == 0:
            download_video(video['url'])
        else:
            for highlight in video['highlight']:
                download_video(video['url'], convertToSeconds(highlight['start']), convertToSeconds(highlight['end']))

main()