from moviepy import *
from moviepy.editor import *
import json
import datetime

def convertToHHMMSS(seconds):
    return str(datetime.timedelta(seconds=seconds))

# data = json.load(open('downloads/download.json'))

def video_trim(video,start=0,end=-1):
    if end != -1:
        edited_video = VideoFileClip(video).subclip(start,end) # Load video and subclip it
    else:
        edited_video = VideoFileClip(video).subclip(start) # Load video and subclip it

    # Make the text. Many more options are available.
    # txt_clip = ( TextClip("My Holidays 2013",fontsize=70,color='white').with_position('center').with_duration(10) )

    result = CompositeVideoClip([edited_video]) # Overlay text on video
    filenamePrefix = video.split('/')[-1].split('.')[0]
    filename = f"{filenamePrefix}_trimmed_{start}-{end}.mp4"
    print(f"[id]{filename}_{start}-{end}[id]")
    print(f"[filename]{filename}[filename]")
    result.write_videofile(f"src/dumps/{filename}",fps=60) # Many options...

if __name__ == '__main__':
    video = sys.argv[1]
    start = int(sys.argv[2])
    end = int(sys.argv[3]) if len(sys.argv) > 3 else -1
    video_trim(video,start,end)

# Usage: python src/modules/video-trim.py <filename> <start>
# Usage: python src/modules/video-trim.py <filename> <start> <end>
# python src/modules/video-trim.py src/dumps/youtube_NyUTYwZe_l4_h2ai.mp4 96 156