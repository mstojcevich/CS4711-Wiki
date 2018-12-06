from rest_framework import viewsets, permissions

from images.models import Image
from images.serializers import ImageSerializer

# TODO images should be add-or-read-only (shouldn't be able to rewrite)


class ImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the images API
    """

    queryset = Image.objects.all().order_by("-upload_date")
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = ImageSerializer
