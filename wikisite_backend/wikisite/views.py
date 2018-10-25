from rest_framework.authtoken.views import ObtainAuthToken as ObtainAuthTokenBase
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

# General views that don't really fit anywhere more specific


# TODO Maybe this one should be in users/views.py
class ObtainAuthToken(ObtainAuthTokenBase):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
        })
