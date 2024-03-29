from rest_framework import serializers
from articles.models import Article, ArticleRevision
from users.serializers import UserSerializer


class ArticleRevisionSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for an article revision
    """

    class Meta:
        model = ArticleRevision
        fields = ("url", "author", "creation_date", "content")


class ArticleRevisionListSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for a list of article revisions (omits large fields)
    """
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = ArticleRevision
        fields = ("url", "author", "creation_date")
        ordering = ("creation_date", "author_name")


class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for an individual article
    """

    content = serializers.CharField(source="latest_revision.content")
    last_updated = serializers.DateTimeField(
        source="latest_revision.creation_date", read_only=True
    )
    revisions = ArticleRevisionListSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = (
            "url", "id", "creation_date", "name", "content",
            "last_updated", "revisions", "locked"
        )

        extra_kwargs = {
            "creation_date": {"read_only": True},
            "locked": {"read_only": True}
        }

    def update(self, instance, validated_data):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        print(repr(validated_data))

        # Create a new revision
        revision = ArticleRevision(
            article=instance,
            author=user,
            content=validated_data["latest_revision"]["content"],
        )
        revision.save()

        return instance

    def create(self, validated_data):
        article = Article(name=validated_data["name"])
        article.save()

        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        # Create the first revision for the article
        revision = ArticleRevision(
            article=article,
            author=user,
            content=validated_data["latest_revision"]["content"],
        )
        revision.save()

        return article


class ArticleListSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for a list of articles (omits larger fields)
    """

    class Meta:
        model = Article
        fields = ("url", "id", "creation_date", "name")
