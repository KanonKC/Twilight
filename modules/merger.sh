# ffmpeg -y -i $1 -r 30 -i $2  -filter:a aresample=async=1 -c:a flac -c:v copy $3
ffmpeg -i $2 -i $1 -c:v copy -c:a aac $3