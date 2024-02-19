import subprocess
import pytube
import re

def download_video(url):

    video = pytube.YouTube(url)
    title = re.sub(r'[^a-zA-Z0-9\s]', '', video.title.replace(" ","_"))
    
    print(f"Start downloading {title}...")

    with open('dumps/urls.txt','w') as f:
        f.write(url)

    with open('dumps/dest.txt','w') as f:
        f.write(title)

    subprocess.call("ts-node modules/downloader.ts", shell=True)
    subprocess.call(f"sh modules/merger.sh dumps/{title}_audio.mp3 dumps/{title}_video.mp4 videos/{title}.mp4", shell=True)
    
    print(f"Downloaded {title}!")

url = input("Enter youtube url: ")
download_video(url)
