from moviepy import *
from moviepy.editor import *
import json

data = json.load(open('dumps/download.json')) 
video = VideoFileClip(f"videos/{data['title']}.mp4").subclip(50,60) # Load video and subclip it

# Make the text. Many more options are available.
# txt_clip = ( TextClip("My Holidays 2013",fontsize=70,color='white').with_position('center').with_duration(10) )

result = CompositeVideoClip([video]) # Overlay text on video
result.write_videofile("TitanEclipseExperience_edited.mp4",fps=25) # Many options...