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

    def create(self, validated_data):
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)

        if "password" in validated_data:
            instance.set_password(validated_data["password"])
        instance.save()
        return instance
