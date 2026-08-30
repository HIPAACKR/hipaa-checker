# APK Extractor

This is the app where you can extract and explore APKs deep inside

### Prerequisites
Make sure you have installed:

- `ruby-3.1.7`
- `bundler`
- `apktool`
- `Java 8+`

## Install apkTool (Linux)
#### ApkTool Doc: https://ibotpeaches.github.io/Apktool/install/

- Copy both files from `project_root/apkTool` and paste it to `/usr/local/bin` with `sudo` privileges

```bash
sudo cp /path_to_file/apktool /path_to_file/apktool.jar /usr/local/bin
```

- Make sure both files are executable `chmod +x`


- Make sure you are on root directory of project and run this:
```bash
cd extracted && python -m SimpleHTTPServer
```
#### For python3:
```bash
cd extracted && python3 -m http.server
```