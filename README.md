# CS4711 Wiki Project

## Project structure

`wikisite_backend/` is the Django project for the wiki site. This contains everything for the backend and for serving the frontend.


## Setting up the development environment

To setup the development environment, you'll need Python 3 and pipenv. On Mac with homebrew or Linux this should be trivial. I have no clue how to do this on Windows, someone should edit this if they know how.

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
