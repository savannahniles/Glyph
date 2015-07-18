from __future__ import unicode_literals #for youtube dl
import os, sys, io, json, subprocess, requests
import urlparse as ups
import youtube_dl #downloading youtube videos
from bs4 import BeautifulSoup
import moviepy
from moviepy.editor import *
import moviepy.video.tools.drawing as dw #for masking
from moviepy.video.tools.cuts import FramesMatches #for loop detection

from requests.compat import chardet # for mime type compare
import magic
import posixpath
import shutil


_STATIC_URL		= "/"
_STATIC_BASE	= "static/video/"


def getVideoInfo(url):
	print "///////////////"
	print "checking URL..."
	if youtube_url_validation(url):
		print "////////////////"
		print "Getting video info..."
		ydl = youtube_dl.YoutubeDL()
		r = None
		with ydl:
			r = ydl.extract_info(url, download=False)  # don't download, much faster
			videoId = r['extractor'].strip().replace("-","") + '-' + r['id']
			print videoId
			outputDir = os.path.join(_STATIC_BASE, videoId)
			infoFileName = os.path.join(outputDir, videoId + '.json')
			if not os.path.exists(outputDir):
				os.makedirs(outputDir)
				download(videoId, url)
			return {'type':'youtube', 'videoId':videoId, 'mime':'video/mp4'}
	if os.path.exists(url):
		mime = magic.from_file(url, mime=True)
		if mime in ["video/mp4","video/webm","video/ogg",\
					"video/quicktime","video/x-flv","video/3gpp" \
					"video/x-msvideo", "video/x-ms-wmv", "video/MP2T", \
					"application/x-mpegURL"]:
					filePath = os.path.join(_STATIC_BASE, posixpath.basename(url))
					shutil.copyfile(url, filePath)
					return {'type':'ondisk','videoId':posixpath.basename(url),'mime':mime}
	r = requests.get(url, stream=False)
	peek = r.iter_content(256).next() # http://stackoverflow.com/a/13198035
	mime = magic.from_buffer(peek, mime=True)
	if mime in ["video/mp4","video/webm","video/ogg",\
				"video/quicktime","video/x-flv","video/3gpp" \
				"video/x-msvideo", "video/x-ms-wmv", "video/MP2T", \
				"application/x-mpegURL"]:

		filePath = os.path.join(_STATIC_BASE, posixpath.basename(url))
		with open(filePath, 'wb') as f:
			for chunk in r.iter_content(chunk_size=1024):
				if chunk: # filter out keep-alive new chunks
					f.write(chunk)
					f.flush()
		return {'type':'downloaded', 'videoId':posixpath.basename(url),'mime':mime}
	else:
		return None





def download(videoId, url):
	print "////////////////"
	print "Downloading video..."

	videoPath = getVideoPath(videoId)
	options = {
	    'extractaudio' : False,      # only keep the audio
	    'format': 'mp4',
	    'outtmpl': videoPath,        # name the file the ID of the video
	    'noplaylist' : True,        # only download single song, not playlist
	}
	with youtube_dl.YoutubeDL(options) as ydl:
		ydl.download([url])

def createThumbnail(videoId, time, startOrEnd):
	print "////////////////"
	print "Processing thumbnail..."
	videoFile = getVideoPath(videoId)
	thumbnailPath = os.path.join(_STATIC_BASE, videoId, startOrEnd + ".png" )
	clip = VideoFileClip(videoFile, audio=False)
	clip.save_frame(thumbnailPath, t=float(time)) # saves the frame a t=2s
	return os.path.join(_STATIC_URL, thumbnailPath)

def loopDetection(videoId):
	print "////////////////"
	print "Looking for loops..."

	outputDir = os.path.join(_STATIC_BASE, videoId)
	selected_scenes_file = os.path.join(outputDir, "loops.txt") #ultimately what we want to fill
	if not os.path.exists(selected_scenes_file):

		videoFile = getVideoPath(videoId)
		clip = VideoFileClip(videoFile, audio=False)

		clip_small = clip.resize(width=150) # Downsize the clip to a width of 150px to speed up things

		matches = FramesMatches.from_clip(clip_small, 5, 3) # Find all the pairs of matching frames an return their corresponding start and end times.
		# matchesFile = os.path.join(outputDir, "matches.txt") # (Optional) Save the matches for later use.
		# matches.save(matchesFile)
		# matches = FramesMatches.load(matchesFile)

		# Filter the scenes: keep only segments with duration >1.5 seconds,
		# where the first and last frame have a per-pixel distance < 1,
		# with at least one frame at a distance 2 of the first frame,
		# and with >0.5 seconds between the starts of the selected segments.
		selected_scenes = matches.select_scenes(match_thr=10, min_time_span=1.5, nomatch_thr=.5, time_distance=1)

		print " ______ loops... ______ " #if any
		selected_scenes.save(selected_scenes_file) #save selected scenes

	scenes = []
	ss = open(selected_scenes_file, "r")
	for line in ss:
		start, end, c, d = line.split("\t")
		scene = {
			'start': start,
			'end': end
		}
		scenes.append(scene)
	return scenes

def time_symetrize(clip):
	""" Returns the clip played forwards then backwards. In case
	you are wondering, vfx (short for Video FX) is loaded by
	>>> from moviepy.editor import * """
	return concatenate([clip, clip.fx( vfx.time_mirror )])

def mask_outsideRegion(clip):
	return clip.fx(vfx.freeze_region, outside_region=(200, 200, 379, 322))

def processGif(videoId, start, end, pixelWidth, loop, maskType, stillFrame, mask, mp4, fps):
	print "////////////////"
	print "Processing your gif..."

	videoFile = getVideoPath(videoId)
	gifPath = getGifPath(videoId, start, end, pixelWidth, loop, maskType, stillFrame, mask, fps)
	print gifPath

	print "--------------"

	print "Making a gif " + pixelWidth + " pixels wide...."

	clip = (VideoFileClip(videoFile, audio=False)
			.subclip(float(start),float(end))
			.resize(width=int(pixelWidth))) #.crop(x1=138.7,x2=640, y1=0, y2=512.8))
	composition = clip
	d = clip.duration

	#deal with looping
	if (loop == "time_symetrize"):
		composition = clip.fx( time_symetrize )
		d = d*2
	if (loop == "progressive_fade"):
		clip = clip.crossfadein(d/2)
		composition = (CompositeVideoClip([clip, clip.set_start(d/2), clip.set_start(d)]).subclip(d/2, 3*d/2))
	if (loop == "still_fade"):
		snapshot = (clip.to_ImageClip()
	            .set_duration(d/6)
	            .crossfadein(d/6)
	            .set_start(5*d/6))
		composition = CompositeVideoClip([clip, snapshot])

	#deal with masking
	if (maskType):
		p = mask.split(',')
	if (maskType == 'maskLeft' or maskType == 'maskRight'): #maskLeft means the left side will be masked, splitRight means right side will be masked
		colLeft = 1 #col1 determines if the left side of the images is still (1) or animated (0)
		colRight = 0
		if maskType == 'maskRight':
			colLeft = 0
			colRight = 1
		clipMask = dw.color_split(clip.size, p1=(float(p[0]), float(p[1])), p2=(float(p[2]), float(p[3])), col1=colLeft, col2=colRight, grad_width=25) # blur the mask's edges
		snapshot = (clip.to_ImageClip(t=(float(stillFrame)))
				.set_duration(d)
				.set_mask(ImageClip(clipMask, ismask=True)))
		composition = CompositeVideoClip([composition,snapshot])
	if (maskType == 'maskOuter'):
		composition = composition.fx(vfx.freeze_region, outside_region=(p[0], p[1], p[2], p[3]))
	if (maskType == 'maskInner'):
		freeze = (composition.fx(vfx.crop, x1=p[0], y1=p[1], x2=p[2], y2=p[3])
				.to_ImageClip(t=(float(stillFrame)))
				.set_duration(d)
				.set_position((p[0],p[1])))
		composition = CompositeVideoClip([composition, freeze])

	print "fps: " + str(fps)
	if (fps == "auto"):
		composition.write_gif(gifPath) #auto
	else:
		composition.write_gif(gifPath, fps=(float(fps)))

	if mp4 == "true":
		print "//////////////////"
		print "Writing your video...."
		mp4Path = getMp4Path(gifPath)
		composition.write_videofile(mp4Path)

	return os.path.join(_STATIC_URL, gifPath)

#-------------------------------------- getters --------------------------------------

def getVideoPath(videoId):
	videoFile = os.path.join(_STATIC_BASE, videoId, videoId + '.mp4')
	return videoFile

def getGifPath(videoId, start, end, pixelWidth, loop, maskType, stillFrame, mask, fps): #returns shots
	outputDir = os.path.join(_STATIC_BASE, videoId, "gifs") #output for everything here
	if not os.path.exists(outputDir):
		os.makedirs(outputDir)
	gifOptions = ""
	if loop:
		gifOptions = "--" + loop
	if maskType:
		gifOptions = gifOptions + "--" + maskType + "--still--" + stillFrame + "_mask" + mask
	gifName = videoId + "_scene_" + start.replace('.', '-') + "_" + end.replace('.', '-') + "--w-" + pixelWidth +"px"+ "--fps-" + str(fps) + gifOptions + ".gif"
	gifPath = os.path.join(outputDir, gifName)
	return gifPath

def getMp4Path(gifPath): #returns shots
	return gifPath.replace(".gif", ".mp4")

#--------------------------------------- helpers ---------------------------------------

def youtube_url_validation(url):
	if not url:
		return False
	m = ups.urlparse(url)
	domain = '{uri.scheme}://{uri.netloc}/'.format(uri=m)
	print domain
	if ("youtube" in domain):
		v = str(ups.parse_qs(m.query)['v'][0])
		print v
		if (len(v) is 11):
			print "Yes! URL checks out."
			try:
			    r = requests.head(url)
			    print r.status_code
			    if r.status_code is 200:
			    	print "Yup! Video is there" + str(r.status_code)
			    	return True
				return False
			except requests.ConnectionError:
			    print("Failed to connect to the URL")
			    return False
	if ("youtu.be" in domain):
		print "youtu.be in domain"
		try:
			r = requests.head(url)
			print r.status_code
			if ((r.status_code == 200) or (r.status_code == 302)):
				print "Yup! Video is there" + str(r.status_code)
				return True
			return False
		except requests.ConnectionError:
			print("Failed to connect to the URL")
			return False


def printGlyph():
	glyph = """

     _/_/_/  _/                      _/
  _/        _/  _/    _/  _/_/_/    _/_/_/
 _/  _/_/  _/  _/    _/  _/    _/  _/    _/
_/    _/  _/  _/    _/  _/    _/  _/    _/
 _/_/_/  _/    _/_/_/  _/_/_/    _/    _/
                  _/  _/
             _/_/    _/                       """
	return glyph;
