from django.contrib import admin
from .models import Article, ArticleRevision, IPBan


admin.site.register(Article)
admin.site.register(ArticleRevision)
admin.site.register(IPBan)
