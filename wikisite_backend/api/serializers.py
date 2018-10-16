from django.contrib.auth.models import User
from rest_framework import serializers


MIN_PW_LENGTH = 6


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ("url", "username", "password")
        extra_kwargs = {
            "password": {
                "write_only": True,
                "min_length": MIN_PW_LENGTH,
                "help_text": f"Required. {MIN_PW_LENGTH} characters or more.",
            }
        }
