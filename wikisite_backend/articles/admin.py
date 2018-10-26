from django.contrib import admin
from .models import Article, ArticleRevision


admin.site.register(Article)
admin.site.register(ArticleRevision)
