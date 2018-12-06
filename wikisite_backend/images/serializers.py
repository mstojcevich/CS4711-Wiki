from rest_framework import serializers
from images.models import Image
from users.serializers import UserSerializer


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    uploaded_by = UserSerializer(
        many=False, read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Image
        fields = ("url", "uploaded_by", "id", "upload_date", "comments", "data")

    def create(self, validated_data):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        image = Image(
            comments=validated_data["comments"],
            data=validated_data["data"],
            uploaded_by=user,
        )
        image.save()

        return image
