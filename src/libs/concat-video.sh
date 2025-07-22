filename=$1

# Remove list.txt if it exists
rm -f list.txt

shift
for video in $@; do
  echo "file '$video'" >> list.txt
done

ffmpeg -safe 0 -f concat -i list.txt -c copy $filename

# Usage: video-concat.sh filename video...