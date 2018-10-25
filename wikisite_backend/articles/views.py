from rest_framework import viewsets, permissions

from articles.models import Article
from articles.serializers import ArticleSerializer, ArticleListSerializer


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
