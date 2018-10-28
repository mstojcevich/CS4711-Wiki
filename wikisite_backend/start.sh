#!/bin/bash
pipenv install
pipenv run python manage.py migrate
pipenv run python manage.py runserver

