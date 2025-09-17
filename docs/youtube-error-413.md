# Youtube Error 413
Error 413 เกิดจากข้อมูล Request ที่ส่งไปมีขนาดใหญ่เกินไป ส่วนใหญ่ของ YT-Dlp จะเกิดจาก Cookie ที่ส่งไปมีขนาดใหญ่เกินไป โดยสามารถตรวจสอบได้จากคำสั่ง
```sh
$ yt-dlp --cookies-from-browser firefox --get-title https://www.youtube.com/watch?v=fEKg0YReYLk --print-traffic
```
## Solution
ลบ Cookie ที่ส่งไปมีขนาดใหญ่เกินไป