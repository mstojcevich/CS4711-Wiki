from django.contrib.auth.models import User
from django.db import models


class Article(models.Model):
    """
    A wiki article
    """

    creation_date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=64, unique=True)
    content = models.TextField()

    @property
    def latest_revision(self):
        return self.articlerevision_set.latest('id')

    def __str__(self):
        return self.name


class ArticleRevision(models.Model):
    """
    A revision of a wiki article
    """

    article = models.ForeignKey(Article, on_delete=models.CASCADE)

    # We shouldn't ever orphan an article, but they can have a null
    # author in case the revision was added by an admin or was migrated
    # from a previous schema w/o authors.
    author = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
