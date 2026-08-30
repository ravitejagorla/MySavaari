from cryptography.fernet import Fernet
from django.conf import settings

fernet = Fernet(settings.CRYPTOGRAPHY_ENCRYPTION_ID)

def encrypt(input_id):
    id_bytes = str(input_id).encode()
    return fernet.encrypt(id_bytes).decode()

def decrypt(encrypted_id):
    decrypted_id = fernet.decrypt(encrypted_id.encode())
    return str(decrypted_id.decode())