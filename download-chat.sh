twitch-dl download -q 1080p 2256742539 -o video.mp4
twitch-dl chat --dark --width 500 --height 1080 2256742539 -o chat.mp4
ffmpeg -i video.mp4 -i chat.mp4 -filter_complex hstack=inputs=2 chat_with_video.mp4
