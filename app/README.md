<h1>Glyph</h1>

<h2>About:</h2>

Backend for Glyph

<h2>Installation</h2>

Step 1: Make sure you’re running Python 2.7.
Step 2: Make sure you have pip installed
Step 3: Make sure you have virtualenv installed 
Step 4: Make sure you have ImageMagick installed
YOU’VE INSTALLED ALL DEPENDENCIES!! 
place the whole `/Glyph` directory in your documents.
Run start.command by double clickling on it. 
this will create a `virtual env`, install the dependencies: 

```
pip install flask moviepy beautifulsoup4 youtube-dl Pillow requests
```

Then run:

```
python um-videoHeadlines-demo.py 1369
```
Which will start the server and open the app. 


You might get an error about a failure to import cv2. MoviePy requires cv2 to run and is the one calling it. You should link your Python wrapper to the Python you're running via your vitural environment. 
——— cd /usr/local/um/glyph/lib/python2.7/site-packages/
——— ln -s /usr/local/lib/python2.7/dist-packages/cv* .

