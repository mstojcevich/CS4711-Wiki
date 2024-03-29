from rest_framework import viewsets, permissions

from articles.models import Article, ArticleRevision, IPBan
from articles.serializers import ArticleSerializer, ArticleListSerializer
from articles.serializers import ArticleRevisionSerializer


class LockedOrAdminPermission(permissions.BasePermission):
    """
    Permission that checks to see if the article is locked
    or if the user is an admin
    """

    def has_object_permission(self, request, view, obj):
        if obj.locked and not request.user.is_superuser:
            return False
        else:
            # Article is unlocked or the user is an admin
            return True


def get_client_ip(request):
    """
    Determine the IP of the user
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class BannedOrAdminPermission(permissions.BasePermission):
    """
    Permission that checks to see if the user is unbanned
    or if the user is an admin
    """

    def has_object_permission(self, request, view, obj):
        is_banned = IPBan.objects.filter(ip=get_client_ip(request)).exists()
        if is_banned and not request.user.is_superuser:
            return False
        else:
            return True


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the articles API
    """

    queryset = Article.objects.all().order_by("-creation_date")
    serializer_class = ArticleSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleSerializer

    def get_permissions(self):
        # Anyone can list, create, and retrieve articles, but to update,
        # we check if the article is locked
        if self.action in ("list", "create", "retrieve"):
            permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
        else:
            permission_classes = (LockedOrAdminPermission & BannedOrAdminPermission,)

        return (permission() for permission in permission_classes)


class ArticleRevisionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the article revision API
    """

    queryset = ArticleRevision.objects.all().order_by("-creation_date")
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_serializer_class(self):
        return ArticleRevisionSerializer
