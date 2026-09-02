from pathlib import Path
from decouple import config
from celery.schedules import crontab

PROJECT_NAME = config("PROJECT_NAME", default="MySavaari")

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config('SECRET_KEY')
ALGORITHM = config('ALGORITHM')
DEBUG = config('PROJECT_PHASE', default='development') == 'development'
ALLOWED_HOSTS = [host.strip() for host in config('HOST_DOMAIN', default='').split(',') if host]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    "drf_spectacular",
    'corsheaders',
    'channels',
    # Apps
    'apps.accounts',
    'apps.datamanagement',
    'apps.generalservices',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

USE_SECONDARY_DB = config("USE_SECONDARY_DB", cast=bool, default=False,)
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE'),
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    },
}
if USE_SECONDARY_DB:
    DATABASES['mysql'] = {
        'ENGINE': config('DB_ENGINE2'),
        'NAME': config('DB_NAME2'),
        'USER': config('DB_USER2'),
        'PASSWORD': config('DB_PASSWORD2'),
        'HOST': config('DB_HOST2'),
        'PORT': config('DB_PORT2'),
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = config('LANGUAGE_CODE')
TIME_ZONE = config('TIME_ZONE')
USE_I18N = config('USE_I18N', cast=bool)
USE_TZ = config('USE_TZ', cast=bool)


_static_url = config('STATIC_URL', default='static').strip('/')
STATIC_URL = f'/{_static_url}/' if _static_url else '/static/'
STATIC_ROOT = BASE_DIR / config('STATIC_ROOT', default='staticfiles').strip('/')
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = config('MEDIA_URL', default='media/')
MEDIA_ROOT = BASE_DIR / config('MEDIA_ROOT', default='media/')

CRYPTOGRAPHY_ENCRYPTION_ID = config('CRYPTOGRAPHY_ENCRYPTION_ID')

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="")
EMAIL_PORT = config("EMAIL_PORT", cast=int, default=587)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool, default=True)
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default=EMAIL_HOST_USER)

ZEPTO_MAIN_API_KEY = config('ZEPTO_MAIN_API_KEY', default='')
ZEPTO_MAIL_ID = config('ZEPTO_MAIL_ID', default='')

RAZORPAY_KEY_ID = config('RAZORPAY_KEY_ID', default='')
RAZORPAY_KEY_SECRET = config('RAZORPAY_KEY_SECRET', default='')

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated',],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

CORS_ALLOWED_ORIGINS = [origin.strip() for origin in config("CORS_ALLOWED_ORIGINS", default="",).split(",") if origin.strip()]

REDIS_HOST = config("REDIS_HOST", default="localhost")
REDIS_PORT = config("REDIS_PORT", cast=int, default=6379)
REDIS_CHANNEL_LAYER_DB = config("REDIS_CHANNEL_LAYER_DB", cast=int, default=0)
REDIS_CELERY_BROKER_DB = config("REDIS_CELERY_BROKER_DB", cast=int, default=10)
REDIS_CELERY_RESULT_DB = config("REDIS_CELERY_RESULT_DB", cast=int, default=11)
REDIS_CHANNEL_LAYER_URL = config("REDIS_CHANNEL_LAYER_URL", default="") or (f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_CHANNEL_LAYER_DB}")

CELERY_BROKER_URL = config("CELERY_BROKER_URL", default="") or (f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_CELERY_BROKER_DB}")
CELERY_RESULT_BACKEND = config("CELERY_RESULT_BACKEND", default="") or (f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_CELERY_RESULT_DB}")
CELERY_ACCEPT_CONTENT = [config("CELERY_ACCEPT_CONTENT", default="json")]
CELERY_TASK_SERIALIZER = config("CELERY_TASK_SERIALIZER", default="json")
CELERY_RESULT_SERIALIZER = config("CELERY_RESULT_SERIALIZER", default="json")
CELERY_TIMEZONE = config("CELERY_TIMEZONE", default="Asia/Kolkata")
CELERY_BEAT_SCHEDULE = {
    
}
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_CHANNEL_LAYER_URL],
        },
    },
}
