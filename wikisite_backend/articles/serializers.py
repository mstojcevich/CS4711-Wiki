from rest_framework import serializers
from articles.models import Article


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for an individual article
    """

    content = serializers.CharField(source="latest_revision.content", read_only=True)
    last_updated = serializers.DateTimeField(
        source="latest_revision.creation_date", read_only=True
    )

    class Meta:
        model = Article
        fields = ("url", "id", "creation_date", "name", "content", "last_updated")

        extra_kwargs = {"creation_date": {"read_only": True}}


class ArticleListSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for a list of articles (omits larger fields)
    """

    class Meta:
        model = Article
        fields = ("url", "id", "creation_date", "name")
