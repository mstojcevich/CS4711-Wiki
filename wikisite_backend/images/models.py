from django.contrib.auth.models import User
from django.db import models


class Image(models.Model):
    comments = models.TextField(null=True)  # Comments included with the image upload
    data = models.ImageField(upload_to="image_uploads/")
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT)
