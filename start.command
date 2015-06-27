echo "                                              
     _/_/_/  _/                      _/       
  _/        _/  _/    _/  _/_/_/    _/_/_/    
 _/  _/_/  _/  _/    _/  _/    _/  _/    _/   
_/    _/  _/  _/    _/  _/    _/  _/    _/    
 _/_/_/  _/    _/_/_/  _/_/_/    _/    _/     
                  _/  _/                      
             _/_/    _/   "
cd Documents;
cd Glyph;
ln -s app/static/video videos;
cd app;
if [ ! -d env ]
then
  echo "there is no virtual environment set up! Setting up now...";
  virtualenv env;
  source env/bin/activate;
  sudo pip install flask moviepy beautifulsoup4 youtube-dl Pillow requests;
fi
echo "virtual environment is set up!";
open Glyph.app/;
source env/bin/activate;
python glyph-server-flask.py 1369;

