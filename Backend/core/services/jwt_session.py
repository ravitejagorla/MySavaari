import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

def generate_login_jwt(user_id, role, exp_days=14, branch_id=None, employee_id=None):
    payload = {
        'user_id': str(user_id),
        'role': role,
        'branch_id': str(branch_id) if branch_id is not None else None,
        'employee_id': str(employee_id) if employee_id is not None else None,
        'exp': datetime.now(timezone.utc) + timedelta(days=exp_days),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def generate_otp_jwt(user_id, exp_days=7):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.now(timezone.utc) + timedelta(days=exp_days),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token has expired.')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Invalid token.')

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
        request.user_info = payload
        user = JWTUser(payload)
        return user, token