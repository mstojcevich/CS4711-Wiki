import pytest
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


@pytest.mark.django_db
class UserIndexTests(APITestCase):
    def test_one_user(self):
        """
        Ensure that the users api returns as expected w/ one user
        """
        User.objects.create_user("test", "test@test.com", "hunter2")

        response = self.client.get("/api/users/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

        response_user = response.data[0]
        assert response_user["username"] == "test"
        assert "password" not in response_user

    def test_order_by_creation(self):
        """
        If there are multiple users, they should be ordered by creation time
        """
        User.objects.create_user("test", "test@test.com", "hunter2")
        User.objects.create_user("test2", "test2@test.com", "hunter3")

        response = self.client.get("/api/users/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

        # First user should be the one that was created second
        first_user = response.data[0]
        assert first_user["username"] == "test2"

        second_user = response.data[1]
        assert second_user["username"] == "test"


@pytest.mark.django_db
class UserCreationTests(APITestCase):
    @staticmethod
    def assert_bad_input(user_data, response):
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # Make sure the user wasn't created
        user_exists = User.objects.filter(
            username=user_data["username"]
        ).exists()
        assert not user_exists

    def test_create_user(self):
        """
        Test the happy path of creating a user
        """
        user_data = {"username": "marcusant", "password": "@dequatePassword1"}
        response = self.client.post(
            "/api/users/", data=user_data, format="json"
        )

        assert response.status_code == status.HTTP_201_CREATED

        # Make sure the user was created in the DB
        user_exists = User.objects.filter(
            username=user_data["username"]
        ).exists()
        assert user_exists

    def test_short_password(self):
        """
        Test that a user w/ too short of a password is rejected
        """
        user_data = {"username": "marcusant", "password": "j"}
        response = self.client.post(
            "/api/users/", data=user_data, format="json"
        )

        UserCreationTests.assert_bad_input(user_data, response)

    def test_missing_password(self):
        """
        Test that a user w/o a password is rejected
        """
        user_data = {"username": "marcusant"}
        response = self.client.post(
            "/api/users/", data=user_data, format="json"
        )

        UserCreationTests.assert_bad_input(user_data, response)

    def test_missing_username(self):
        """
        Test that a user w/o a username is rejected
        """
        user_data = {"password": "@dequatePassword1"}

        # Since we don't have a username to look for, just
        # make sure that nothing got added to the DB
        prev_num_users = User.objects.count()

        response = self.client.post(
            "/api/users/", data=user_data, format="json"
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        new_num_users = User.objects.count()
        assert new_num_users == prev_num_users
