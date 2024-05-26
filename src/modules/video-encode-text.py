import base64
import sys
import bson
import json

def videoEncodeText(file,text):
    fh = open(file, "wb")
    # fh.write(base64.b64decode(text))
    print(text,type(text))
    print("OK",json.loads(text))
    # print("OK",bson.dumps(text))
    fh.write(bson.dumps(json.loads(text)))
    fh.close()

if __name__ == "__main__":
    file = sys.argv[1]
    text = sys.argv[2]
    videoEncodeText(file,text)

# Usage: python src/modules/video-encode-text.py <file> <text>
# python src/modules/video-encode-text.py src/dumps/twitch_1214826771_MnjN.mp4 '{"text":"Hello","padding":"00"}'