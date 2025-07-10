import cv2
import numpy as np

# Load template and video
template = cv2.imread("r6-detect.png", 0)  # grayscale
video = cv2.VideoCapture("dumps/youtube_od0upbELg64_lffC.mp4")

threshold = 0.8  # tune based on game

frame_count = 0
fps = video.get(cv2.CAP_PROP_FPS)
matches = []

while True:
    ret, frame = video.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    res = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(res >= threshold)

    if len(loc[0]) > 0:
        timestamp = frame_count / fps
        matches.append(timestamp)

    frame_count += 1

video.release()
print("Kill timestamps:", matches)
