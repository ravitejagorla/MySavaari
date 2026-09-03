from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .jwt_session import decode_jwt

class JWTUser:
    """
    A simple user-like object for DRF authentication,
    so IsAuthenticated works without a Django User.
    """
    def __init__(self, payload):
        self.payload = payload

    @property
    def is_authenticated(self):
        return True

    def get_payload(self):
        return self.payload

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
            token = token.strip('"')
        except ValueError:
            raise AuthenticationFailed('Invalid Authorization header format.')

        payload = decode_jwt(token)
        if not payload:
            raise AuthenticationFailed('Invalid or expired token.')

        # Attach payload as request.user_info for your view
        request.user_info = payload

        # Return a user-like object for DRF permission checks
        user = JWTUser(payload)
        return (user, token)