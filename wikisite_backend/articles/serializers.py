from rest_framework import serializers
from articles.models import Article


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for an individual article
    """
    class Meta:
        model = Article
        fields = ('url', 'creation_date', 'name', 'content')

        extra_kwargs = {
            "creation_date": {
                "read_only": True,
            }
        }


class ArticleListSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for a list of articles (omits larger fields)
    """
    class Meta:
        model = Article
        fields = ('url', 'creation_date', 'name')
