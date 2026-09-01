import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"

def generate_login_jwt(user_id, role, exp_days=14, branch_id=None, branch_uuid=None, employee_id=None):
    payload = {
        "user_id": str(user_id),
        "role": role,
        "branch_id": str(branch_id),
        "branch_uuid": str(branch_uuid),
        "employee_id": str(employee_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=exp_days)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def generate_otp_jwt(user_id,exp_days=7):
    payload = {
        'user_id': str(user_id),
        "exp":datetime.now(timezone.utc) + timedelta(days=exp_days)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token



def decode_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
        