from cryptography.fernet import Fernet
from django.conf import settings

def encrypt(input_id):
    fernet = Fernet(settings.CRYPTOGRAPHY_ENCRYPTION_ID)
    id_bytes = str(input_id).encode()
    return fernet.encrypt(id_bytes).decode()

def decrypt(encrypted_id):
    fernet = Fernet(settings.CRYPTOGRAPHY_ENCRYPTION_ID)
    decrypted_id = fernet.decrypt(encrypted_id.encode())
    return str(decrypted_id.decode())