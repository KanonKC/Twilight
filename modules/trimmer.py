from moviepy import *
from moviepy.editor import *
import json
import datetime

def convertToHHMMSS(seconds):
    return str(datetime.timedelta(seconds=seconds))

data = json.load(open('downloads/download.json'))

start = data['start']
end = data['end']

if end != -1:
    video = VideoFileClip(f"videos/{data['title']}.mp4").subclip(start,end) # Load video and subclip it
else:
    video = VideoFileClip(f"videos/{data['title']}.mp4").subclip(start) # Load video and subclip it

# Make the text. Many more options are available.
# txt_clip = ( TextClip("My Holidays 2013",fontsize=70,color='white').with_position('center').with_duration(10) )

result = CompositeVideoClip([video]) # Overlay text on video
result.write_videofile(f"videos/trimmed/{data['title']}_{start}-{end}.mp4",fps=60) # Many options...