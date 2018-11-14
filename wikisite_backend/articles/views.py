from rest_framework import viewsets, permissions

from articles.models import Article, ArticleRevision
from articles.serializers import ArticleSerializer, ArticleListSerializer
from articles.serializers import ArticleRevisionSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the articles API
    """

    queryset = Article.objects.all().order_by("-creation_date")
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleSerializer


class ArticleRevisionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the article revision API
    """

    queryset = ArticleRevision.objects.all().order_by("-creation_date")
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_serializer_class(self):
        return ArticleRevisionSerializer
