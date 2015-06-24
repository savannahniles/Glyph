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
cd app;
if [ ! -d env ]
then
  echo "there is no virtual environment set up";
  virtualenv env;
  source env/bin/activate;
  pip install flask moviepy beautifulsoup4 youtube-dl Pillow requests;
fi
echo "env is set up!";
open Glyph.app/;
source env/bin/activate;
python glyph-server-flask.py 1369;

