# wikisite_frontend
Wikisite frontend application

## Choosing your developer environment
Wikisite_frontend is built primarily upon JavaScript and related toolings. 
In theory these are multi-platform, however, you will find a much easier workflow while using them in UNIX-like environments.
If using Windows, I __highly__ recommend using the Ubuntu Subsystem that provides you with a Linux Bash terminal.

### Installation
1. Install Git in order to clone this repository and eventually commit any changes you may make

  _OSX_
    1. Install Brew at https://brew.sh
    2. Run `brew install git` in your favorite terminal
    
  _Linux_
    1. Open your favorite terminal and make sure git is installed
    2. If it is not, use your distro's package manager to install it
    
  _Windows_
    1. After enabling the Linux subsystem (Google it), check that git is installed
    2. If it is not, `apt-get install git` should be sufficient to get it installed
    
2. Install Node and npm in order to install dependencies, compile/transpile react, and run our server
  
  _OSX_
    1. After installing Brew, Open your favorite terminal and run `brew install node`
    2. Check that it is installed with `node -v`. This should return a version number in your terminal
  
  _Linux_
    1. Open your favorite terminal and install using this [reference](https://nodejs.org/en/download/package-manager/)
    2. Check that it is installed with `node -v`. This should return a version number in your terminal
    
  _Windows_
    1. In Bash, run `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -` then `sudo apt-get install -y nodejs`
    2. Check that it is installed with `node -v`
    
3. Clone this repository
  1. In your favorite terminal, navigate to whatever directory you want to store this repo in
  2. Run `git clone https://github.com/mstojcevich/CS4711-Wiki.git`
  
4. Install package dependencies
  1. In your favorite terminal, navigate into `CS4711-Wiki/wikisite_frontend`
  2. Run `npm install`. This should download a bunch of packages into a new node_modules folder. __Make sure this exists__
  
5. Rejoice, for you are now ready to spend countless hours trying to figure out how everything works! __Enjoy__ 

From this point on, there should not be any platform disparities as far as development goes.

### Application Debugging
All of these steps should be completed in the root of the `wikisite_frontend` directory

1. cd to the wikisite_frontend root directory and run `npm install`.
2. launch the Django API server.
3. In another terminal instance/tab, run `npm start`. This will open a browser with the front-end loaded. It will refresh whenever changes are saved to any file in `wikisite_frontend/src/`.
4. Connect to http://localhost:3000/ in your favorite browser if it is not open already

Make sure both commands are running separately in order to have full site functionality.

Whenever you make a change to the API files, you only need to re-launch the server for changes to appear.
If changes are made to any react files, the site will automatically refresh.

### Application Testing
To test a production-optimized version of the application, run the following commands.
1. cd to the wikisite_frontend root directory and run 'npm install'.
2. build the latest front-end with `npm run build`
3. launch the Django API server.
4. Connect to http://localhost:8000/ in your favorite browser

Running the application in this way is easier but the build takes a while to complete.
Django will serve the frontend files from the build directory.
Use the __Application Debugging__ steps above while developing.