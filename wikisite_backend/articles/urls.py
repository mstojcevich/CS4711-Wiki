from django.urls import path

from . import views

# This file contains routes to different views
# within the "pages" app

urlpatterns = [
    path('', view=views.index, name='articles-index')
]
