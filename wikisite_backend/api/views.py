from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from . import serializers


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed and edited.
    """

    # Anybody can create a user
    permission_classes = (permissions.AllowAny,)

    serializer_class = serializers.UserSerializer
    queryset = User.objects.all().order_by("-date_joined")
