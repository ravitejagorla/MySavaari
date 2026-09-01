def send_otp_sms(recipient_phone, otp, purpose="OTP Verification", expiry_minutes=5):
    print("=" * 80)
    print("SMS OTP")
    print(f"Phone   : {recipient_phone}")
    print(f"Purpose : {purpose}")
    print(f"OTP     : {otp}")
    print(f"Expires : {expiry_minutes} minutes")
    print("=" * 80)
    return True