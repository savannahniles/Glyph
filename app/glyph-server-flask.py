from flask import Flask, render_template, request, redirect, url_for     # for running the Flask server
import sys                                                               # for obtaining command line arguments
import json
import csv
import time
import urllib
from os.path import relpath

#helper functions
import video

app = Flask(__name__)
app.debug=True



#route to look for loops
@app.route('/test', methods=['GET'])
def test():
    errorCode = 0
    test = "hello world"
    response = {'errorCode' : errorCode, 'test': test}
    return json.dumps(response)

#home/start page
@app.route('/')
def umVideoHeadlinesDemo():
    print video.printGlyph();
    return render_template('um-videoHeadlines-demo.html')

#page for editing a video
@app.route('/authoringTool/<videoId>')
def authoringTool(videoId):
    typeVid = request.args.get('type')
    mime = urllib.unquote(request.args.get('mime')).decode('utf8')
    videoId = urllib.unquote(videoId).decode('utf8')
    if typeVid != "youtube":
        videoId = '../' + video._STATIC_BASE + videoId + '/' + videoId

    #check to see if there's a video folder here
    #if not, download
    return render_template('authoringTool.html', videoId=videoId,type=typeVid,mime=mime)


#------- API ---------


#POST request to download video on submit and redirect to editting tool
@app.route('/authoringTool/', methods=['POST'])
def submitUrl():
    url=request.form['url']
    infos = video.getVideoInfo(url) #testing
    print video.printGlyph()
    if infos:
        return redirect(url_for('authoringTool', \
        videoId=urllib.quote_plus(infos['videoId']), \
        type=infos['type'],mime=infos['mime']))
    else:
        error = "There was an issue downloading that video...Give it another shot, or try something else."
        return redirect(url_for('umVideoHeadlinesDemo', error=error))

@app.route('/authoringTool/makeGif/<videoId>', methods=['GET'])
def makeGif(videoId):
    errorCode = 0
    start = request.args.get('start')
    end = request.args.get('end')
    pixelWidth = request.args.get('pixelWidth')
    gif = None
    loop = request.args.get('loop')
    stillFrame = request.args.get('stillFrame')
    maskType = request.args.get('maskType')
    mask = request.args.get('mask')
    mp4 = request.args.get('mp4')
    fps = request.args.get('fps')
    print fps
    if (not start or not end): #check to make sure start and end are in the URL, change to None to avoid errors if not
        errorCode = "no start or end time"
        start = 0
        end = 0
    if (not pixelWidth):
        pixelWidth = 600
    else:
        gif = video.processGif(videoId, start, end, pixelWidth, loop, maskType, stillFrame, mask, mp4, fps)
        if (not gif): #check to see if there was a problema nd there's no gif
            errorCode = "no gif"
    response = {'errorCode' : errorCode, 'videoId': videoId, 'start': float(start), 'end': float(end), 'pixelWidth': float(pixelWidth), 'loop': loop, 'maskType': maskType, 'stillFrame': stillFrame, 'mask': mask, 'gif': gif, 'mp4': mp4, 'fps': fps}
    print video.printGlyph();
    return json.dumps(response)

#route to generate a thumbnail
@app.route('/authoringTool/makeThumbnails/<videoId>', methods=['GET'])
def makeThumbnails(videoId):
    errorCode = 0
    start = request.args.get('start')
    end = request.args.get('end')
    type = request.args.get('type')
    startThumb = None
    endThumb = None
    ts = str(time.time())
    if (not start or not end): #check to make sure start and end are in the URL, change to None to avoid errors if not
        errorCode = "no start or end time"
        start = 0
        end = 0
    else:
        startThumb = video.createThumbnail(videoId, start, "start") + "?time=" + ts
        endThumb = video.createThumbnail(videoId, end, "end") + "?time=" + ts
        if (not startThumb or not endThumb): #check to see if there was a problema nd there's no gif
            errorCode = "no thumbnails"
    response = {'errorCode' : errorCode, 'startThumb': startThumb, 'endThumb': endThumb}
    print video.printGlyph();
    return json.dumps(response)

#route to look for loops
@app.route('/authoringTool/loopDetection/<videoId>', methods=['GET'])
def returnLoops(videoId):
    errorCode = 0
    loops = video.loopDetection(videoId)
    response = {'errorCode' : errorCode, 'loops': loops}
    print video.printGlyph();
    return json.dumps(response)


#------- Serving ---------


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print "USAGE: python glyph-server-flask.py [port #]"
    else:
        app.run(port = int(sys.argv[1])) # run on the specified port number
    # app.run(host = "0.0.0.0", port = 7500)
