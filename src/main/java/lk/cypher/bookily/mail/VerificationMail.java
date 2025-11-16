package lk.cypher.bookily.mail;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;

public class VerificationMail extends Mailable {
    private final String to;
    private final String verificationCode;

    public VerificationMail(String to, String verificationCode) {
        this.to = to;
        this.verificationCode = verificationCode;
    }

    public String getTo() {
        return to;
    }

    public String getSubject() {
        return "Verify your Bookily Account";
    }

    @Override
    public void build(Message message) throws MessagingException {
        try {
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(to, false));
            message.setSubject(getSubject());
            message.setContent(getBody(), "text/html; charset=utf-8");
        } catch (Exception e) {
            throw new MessagingException("Failed to build verification email", e);
        }
    }

    public String getBody() {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
                ".header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }" +
                ".content { padding: 40px 30px; }" +
                ".content h2 { color: #667eea; margin-top: 0; font-size: 22px; }" +
                ".content p { font-size: 16px; color: #555; margin: 15px 0; }" +
                ".code-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 3px; margin: 30px 0; }" +
                ".code-box { background-color: #ffffff; padding: 25px; text-align: center; border-radius: 6px; }" +
                ".code-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }" +
                ".code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; }" +
                ".info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0; border-radius: 4px; }" +
                ".info-box p { margin: 0; font-size: 14px; color: #666; }" +
                ".book-icon { font-size: 48px; margin-bottom: 10px; }" +
                ".footer { background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0; }" +
                ".footer p { margin: 5px 0; font-size: 13px; color: #777; }" +
                ".button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='book-icon'>📚</div>" +
                "<h1>Welcome to Bookily!</h1>" +
                "<p>Your gateway to endless reading adventures</p>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Verify Your Account</h2>" +
                "<p>Thank you for joining Bookily! We're excited to have you as part of our reading community.</p>" +
                "<p>To complete your registration and start exploring our collection, please use the verification code below:</p>" +
                "<div class='code-container'>" +
                "<div class='code-box'>" +
                "<div class='code-label'>Verification Code</div>" +
                "<div class='code'>" + verificationCode + "</div>" +
                "</div>" +
                "</div>" +
                "<div class='info-box'>" +
                "<p><strong>⏰ This code will expire in 24 hours.</strong></p>" +
                "<p>For your security, please do not share this code with anyone.</p>" +
                "</div>" +
                "<p>Once verified, you'll be able to:</p>" +
                "<ul style='color: #555; line-height: 1.8;'>" +
                "<li>Browse our extensive book collection</li>" +
                "<li>Save your favorite books</li>" +
                "<li>Track your reading progress</li>" +
                "<li>Join our community of book lovers</li>" +
                "</ul>" +
                "<p style='margin-top: 30px;'>If you didn't create a Bookily account, you can safely ignore this email.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p><strong>Bookily Team</strong></p>" +
                "<p>Happy Reading! 📖</p>" +
                "<p style='margin-top: 15px; font-size: 11px;'>This is an automated message, please do not reply to this email.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}