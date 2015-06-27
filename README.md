<h1>Glyph</h1>

<h2>Launching in the next day or so...</h2>

<p>Glyph is a tool for generating expressive gifs from video, including seamless loops and cinemagraphs. Glyph was developed to expand the possibilities of excerpting video: sometimes, there's value in sharing a video clip with more richness, more evocativeness, more subtly, or more "glanceability" than a straight excerpt. Glyph makes simple transformations to gifs and video clips that might otherwise require photoshop, allowing you to automatically detect perfect loops that occur in a video, create the appearance of seamless motion in a non-looping clip, still some regions of movement in a clip to highlight others, or imbue a still frame with subtle dynamism. </p>

<p>Glyph might be (and should be) used to quickly make beautiful, interesting, or funny gifs that loop gracefully. But I'm really interested in how seamlessly looping gifs can be used in news media. We can read a headline in 140 characters or less, but there's an emotional dimension to the informative function of the news. When we read the news we participate in a collective emotional experience, like grief, celebration, worry, wonder, etc. News video is a crucial vector forthese shared emotional experiences, which can propel civic action. But video comes at a high cost in time and attention. Powerful video excerpts and gifs can reach us on high-volume news and social feeds like Twitter, or on mobile and wearable devices-- the interfaces we depend on to peripherally and intermittently connect us throughout the day to the world beyond our first-hand experiences. Quickly creating or remixing media to build immediate, powerful, and cogent images and moving images can have civic importance. </p>

<p>I've written about using gifs and seamlessly-looping gifs in news media on FOLD and for my thesis at the MIT Media Lab, where Glyph was developed. </p>

<p>Glyph is built with Zulko's amazing python library for video manipulation, MoviePy. It was developed by Savannah Niles at the MIT Media Lab with support from the Ultimate Media program, and under the advising of Andy Lippman, Mike Bove, and Ethan Zuckerman. </p>

<p>Glyph is open-source. You can contribute to the project here on GitHub. </p>

<p>If you make cool gifs with Glyph, send them to me. </p>

<h2>Installation</h2>

Step 1: Make sure you’re running Python 2.7.
Step 2: Make sure you have pip installed
Step 3: Make sure you have virtualenv installed 
Step 4: Make sure you have ImageMagick installed
YOU’VE INSTALLED ALL DEPENDENCIES!! 

Download this directory. Delete Glyph-nw, (that's the nodewebkit app for the front end, which I keep here for my own purposes, but you don't need it).

Place the whole `/Glyph` directory in your documents.

Run start.command by double clickling on it. This will create a `virtual env`, install the dependencies: 

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

