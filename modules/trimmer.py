from moviepy import *
from moviepy.editor import *

video = VideoFileClip("TitanEclipseExperience.mp4").subclip(50,60) # Load video and subclip it

# Make the text. Many more options are available.
txt_clip = ( TextClip("My Holidays 2013",fontsize=70,color='white').with_position('center').with_duration(10) )

result = CompositeVideoClip([video, txt_clip]) # Overlay text on video
result.write_videofile("TitanEclipseExperience_edited.webm",fps=25) # Many options...