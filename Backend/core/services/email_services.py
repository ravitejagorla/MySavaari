from django.conf import settings
from django.core.mail import EmailMultiAlternatives

def send_otp_email( recipient_email, otp, name, purpose="OTP Verification", expiry_minutes=5):
    subject = f"{settings.PROJECT_NAME} - {purpose}"
    text_content = (
        f"Your OTP for {purpose} is {otp}.\n\n"
        f"This OTP is valid for {expiry_minutes} minutes.\n\n"
        "If you did not request this OTP, please ignore this email."
    )

    html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{purpose}</title>
        </head>
        <body>
            <h2>{settings.PROJECT_NAME}</h2>
            <p>Hello {name},</p>
            <p>You requested an OTP for <strong>{purpose}</strong>.</p>
            <p>Your OTP is:</p>
            <h1>{otp}</h1>
            <p>This OTP is valid for <strong>{expiry_minutes} minutes</strong>.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Regards,<br> {settings.PROJECT_NAME} Team</p>
        </body>
        </html>
    """

    email = EmailMultiAlternatives(subject=subject, body=text_content, from_email=settings.DEFAULT_FROM_EMAIL, to=[recipient_email])
    email.attach_alternative(html_content, "text/html")
    print("=" * 80)
    print("Email OTP")
    print(f"Email   : {recipient_email}")
    print(f"Purpose : {purpose}")
    print(f"OTP     : {otp}")
    print(f"Expires : {expiry_minutes} minutes")
    print("=" * 80)
    return email.send()

