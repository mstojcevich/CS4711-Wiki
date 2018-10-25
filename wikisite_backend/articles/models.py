from django.contrib.auth.models import User
from django.db import models


class Article(models.Model):
    """
    A wiki article
    """

    creation_date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=64, unique=True)
    content = models.TextField()


class ArticleRevision(models.Model):
    """
    A revision of a wiki article
    """

    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    creation_date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
