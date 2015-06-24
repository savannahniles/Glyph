<h1>Glyph</h1>

<h2>About:</h2>

Backend for Glyph

<h2>Installation</h2>

To install this application, first block out a few hours of an afternoon. Just kidding. I think this should take care of things:

First install OpenCV, ffmpeg, and Imagemagik on your system. You can use Homebrew.

Then install python dependencies in your virtual environment:

```
pip install flask moviepy beautifulsoup4 youtube-dl Pillow requests
```

Then just run:

```
python um-videoHeadlines-demo.py 5000
```

You might get an error about a failure to import cv2. MoviePy requires cv2 to run and is the one calling it. You should link your Python wrapper to the Python you're running via your vitural environment. 
——— cd /usr/local/um/glyph/lib/python2.7/site-packages/
——— ln -s /usr/local/lib/python2.7/dist-packages/cv* .

