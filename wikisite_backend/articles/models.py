from django.contrib.auth.models import User
from django.db import models


class Article(models.Model):
    """
    A wiki article
    """

    creation_date = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=64, unique=True)
    locked = models.BooleanField(default=False, null=False)

    @property
    def latest_revision(self):
        return self.revisions.latest("id")

    def __str__(self):
        return self.name


class ArticleRevision(models.Model):
    """
    A revision of a wiki article
    """

    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='revisions'
    )

    # We shouldn't ever orphan an article, but they can have a null
    # author in case the revision was added by an admin or was migrated
    # from a previous schema w/o authors.
    author = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return str(self.article) + " - " + str(self.creation_date)


class IPBan(models.Model):
    ip = models.GenericIPAddressField(null=False, unique=True, db_index=True)
    reason = models.TextField(null=True)

    def __str__(self):
        return self.ip + ": " + self.reason
