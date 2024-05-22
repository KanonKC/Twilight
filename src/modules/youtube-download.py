import sys
from yt_dlp import YoutubeDL
from yt_dlp.utils import download_range_func
import random
import string

def generate_random_string(length=4):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def download_video(url, path="src/music"):

    URLS = url
    random_string = generate_random_string(4)

    with YoutubeDL() as ydl:
        info_dict = ydl.extract_info(URLS, download=False)
        video_id = info_dict.get("id", None)
        video_title = info_dict.get("title", None)
        # print(info_dict)
        print(f"[video_unique_id]youtube_{video_id}_{random_string}[video_unique_id]")
        print(f"[filename]youtube_{video_id}_{random_string}.mp4[filename]")
        print(f"[platform_id]{video_id}[platform_id]")
        print(f"[video_title]{video_title}[video_title]")
        # print(f"[video_title]{}[video_title]")

    if video_id is None:
        return
    
    ydl_opts = {
        # 'format': 'bestaudio/best',
        'verbose': False,
        'format_sort': ['ext:mp4:m4a'],
        'paths': {'home': '{}'.format(path)},
        'outtmpl': f"youtube_{video_id}_{random_string}",
        # 'download_ranges': download_range_func(None, [(96, 156)]),
        # 'force_keyframes_at_cuts': True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        ydl.download(URLS)

if __name__ == '__main__':
    url = sys.argv[1]
    # filename = sys.argv[2]
    download_video(url,'src/dumps')

# Usage: python src/modules/youtube-download.py <url>
# python src/modules/youtube-download.py https://www.youtube.com/watch?v=NyUTYwZe_l4