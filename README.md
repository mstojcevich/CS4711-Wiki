# CS4711 Wiki Project

## Project structure

`wikisite_backend/` is the Django project for the wiki site. This contains everything for the backend and for serving the frontend.


## Setting up the development environment

To setup the development environment, you'll need Python 3 and pipenv. On Mac with homebrew or Linux this should be trivial. 

### Installing Python 3 and pipenv on Windows
  
  Step 1: Install Node.js
        1) Download the Windows installer from the Nodes.js® web site.
        2) Run the installer (the .msi file you downloaded in the previous step.)
        3) Follow the prompts in the installer (Accept the license agreement, click the NEXT button a bunch of times and accept the                 default installation settings).
        4) Restart your computer. You won’t be able to run Node.js® until you restart your computer.
        5) Open Windows PowerShell as Administrator and run `node -v npm -v` to ensure proper installation.
  
  Step 2: Install Python 3.* and pip
        1) Go to the latest release of Python 3: https://www.python.org/downloads/release/python-371/
        2) Choose the appropriate Installer based on your system, 32/64 bit, AMD/Intel, etc..
        3) Once the installer opens click Install Now, it may ask for Admin approval.
        4) Allow for MAX_PATH overide if needed
        5) Finish Installation
        6) Open Windows PowerShell as Admin and run `py --version` to ensure proper installation of Python v3.*
        7) Download this file: https://bootstrap.pypa.io/get-pip.py and save it to your Desktop
        8) Locate the file you just downloaded, right click Open With > Python. If python was installed correctly it should open a cmd prompt and install pip.
        
  Step 3: Setup Environment Variables
        1) Search for "Python" in the Start menu, right click > Open File Location, on the appropriate version of python.
        2) Copy that path, it should look something like `C:\Users\username\AppData\Local\Programs\Python\Python37`
        3) Search for "Environment Variable" in the Start menu and click on the first option. Next click the Environmental Variables button.
        4) Under System variables locate the Path variable, then double click on it.
        5) A new window will open up, select New and paste the path you found in Step 2 and click OK.
        6) Open cmd and run `pip` to ensure proper installation.
       
  Step 4: Install pipenv
        1) Open cmd and run `pip install pipenv`
        2) Run `pipenv` to ensure proper installation.
  

Once you have pipenv, run the following in the `wikisite` directory.

```
$ pipenv install
```

This command will create a new Python virtual environment with the correct Python version and library versions. You'll need to do this each time a library is added or updated (but it'll be quicker each time).

### Common problems

The current version of `pipenv` doesn't work with the current version of `pip` (heh), which will result in an error about
calling a module as a function. To fix this, run the following
command:

```
$ pipenv run pip install pip==18.0
```


## Running the project

To run the project, you need to enter the virtual environment. To do so, run the following command:

```
$ pipenv shell
```

This will setup your environment so that the correct Python version and libraries will be used.

Next, you need to run the Django application:

```
$ python manage.py migrate && python manage.py runserver
```

This will make any necessary changes to the database and then start up the server.

## Editor recommendation

Opening the `wikisite` directory with an up-to-date version of PyCharm will probably provide the easiest setup process. PyCharm has integrated support for Pipenv and should deal with dependencies for you.


Feel free to use whatever you want, as long as it supports Python virtual environments (I use VS Code).
