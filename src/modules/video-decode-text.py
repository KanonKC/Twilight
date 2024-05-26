import base64
import sys
import bson

def videoDecodeText(file):
    with open(file, "rb") as videoFile:
        # text = base64.b64encode(videoFile.read())
        # print(bson.loads(videoFile.read()))
        text = bson.loads(videoFile.read())
    print(text)

if __name__ == "__main__":
    file = sys.argv[1]
    text = videoDecodeText(file)

# Usage: python src/modules/video-decode-text.py <file>
# python src/modules/video-decode-text.py src/dumps/twitch_1214826771_MnjN.mp4