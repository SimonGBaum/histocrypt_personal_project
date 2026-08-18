from django.test import TestCase


class AuthFlowTest(TestCase):

    def test_01_register_login_and_access_protected_endpoint(self):
        register = self.client.post(
            "/api/v1/users/register/",
            {
                "username": "tester",
                "password": "TestPass2026",
                "email": "tester@example.com",
                "first_name": "Test",
                "last_name": "Er",
            },
            content_type="application/json",
        )
        self.assertEqual(register.status_code, 201)
        self.assertNotIn("password", register.json())

        denied = self.client.get("/api/v1/users/info/")
        self.assertEqual(denied.status_code, 401)

        login = self.client.post(
            "/api/v1/users/login/",
            {"username": "tester", "password": "TestPass2026"},
            content_type="application/json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertIn("access_token", login.cookies)
        self.assertIn("refresh_token", login.cookies)

        allowed = self.client.get("/api/v1/users/info/")
        self.assertEqual(allowed.status_code, 200)
        self.assertEqual(allowed.json()["username"], "tester")
