"""wikisite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from users.views import UserViewSet
from rest_framework.schemas import get_schema_view
from django.conf.urls.static import static
from rest_framework.renderers import CoreJSONRenderer
from wikisite.views import ObtainAuthToken

api_router = routers.DefaultRouter()
api_router.register(r"users", UserViewSet)

schema_view = get_schema_view(title='Wiki API', renderer_classes=[CoreJSONRenderer])

urlpatterns = [
    path("health/", include("health_check.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("admin/", admin.site.urls),
    path("api/", include(api_router.urls)),
    path("api-token-auth/", ObtainAuthToken.as_view()),
    path("schema/", schema_view),
] + static("/", document_root="../wikisite_frontend/build/")

