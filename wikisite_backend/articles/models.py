from django.db import models


class Article(models.Model):
    """
    A wiki article
    """
    creation_date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=64, unique=True)
    content = models.TextField()
