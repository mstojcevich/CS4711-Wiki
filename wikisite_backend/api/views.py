from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from . import serializers


class IsSelfPermission(permissions.BasePermission):
    """
    Permission that checks to see if a user is the currently
    authenticated user.
    """

    def has_object_permission(self, request, view, obj):
        return request.user == obj


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """

    serializer_class = serializers.UserSerializer
    queryset = User.objects.all().order_by("-date_joined")

    def get_permissions(self):
        # Everybody can list users, create users, and retrieve users,
        # but users can only modify or delete themselves
        if self.action in ("list", "create", "retrieve"):
            permission_classes = (permissions.AllowAny,)
        else:
            permission_classes = (IsSelfPermission,)

        return (permission() for permission in permission_classes)
