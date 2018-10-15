import pytest
from django.contrib.auth.models import User
from rest_framework.test import force_authenticate
from rest_framework.test import APITestCase

@pytest.mark.django_db
class UserIndexTests(APITestCase):

    def test_one_user(self):
        """
        Ensure that the users api returns as expected w/ one user
        """
        User.objects.create_user('test', 'test@test.com', 'hunter2')
        
        response = self.client.get('/api/users/')
        assert response.status_code == 200
        assert len(response.data) == 1
        
        response_user = response.data[0]
        assert response_user['username'] == 'test'
        assert 'password' not in response_user

    def test_order_by_creation(self):
        """
        If there are multiple users, they should be ordered by creation time
        """
        User.objects.create_user('test', 'test@test.com', 'hunter2')
        User.objects.create_user('test2', 'test2@test.com', 'hunter3')
        
        response = self.client.get('/api/users/')
        assert response.status_code == 200
        assert len(response.data) == 2
       
        # First user should be the one that was created second
        first_user = response.data[0]
        assert first_user['username'] == 'test2'

        second_user = response.data[1]
        assert second_user['username'] == 'test'

