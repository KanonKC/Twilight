from .services import download_video

url = input("Enter youtube url: ")
download_video.download_video(url)