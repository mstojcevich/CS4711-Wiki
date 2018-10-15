from django.contrib.auth.models import User
from rest_framework import viewsets
from . import serializers


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    serializer_class = serializers.UserSerializer
    queryset = User.objects.all().order_by('-date_joined')
