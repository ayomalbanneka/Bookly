package lk.cypher.bookliy.mail;

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
        return "Verify your Bookly Account";
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
                "* { margin: 0; padding: 0; box-sizing: border-box; }" +
                "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; }" +
                ".email-wrapper { max-width: 600px; margin: 0 auto; }" +
                ".email-container { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative; }" +
                ".header::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 100px; background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 120\"><path fill=\"%23ffffff\" d=\"M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\" opacity=\".25\"/><path fill=\"%23ffffff\" d=\"M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z\" opacity=\".5\"/><path fill=\"%23ffffff\" d=\"M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z\"/></svg>') no-repeat center bottom; background-size: cover; }" +
                ".logo-circle { width: 100px; height: 100px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; border: 3px solid rgba(255,255,255,0.3); }" +
                ".logo { width: 50px; height: 50px; }" +
                ".header h1 { color: #ffffff; font-size: 36px; font-weight: 700; margin-bottom: 12px; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                ".header p { color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 400; }" +
                ".content { padding: 60px 40px 50px; }" +
                ".welcome-text { text-align: center; margin-bottom: 45px; }" +
                ".welcome-text h2 { color: #1a202c; font-size: 28px; font-weight: 700; margin-bottom: 15px; }" +
                ".welcome-text p { color: #4a5568; font-size: 16px; line-height: 1.6; max-width: 450px; margin: 0 auto; }" +
                ".code-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 40px; text-align: center; margin: 40px 0; position: relative; overflow: hidden; }" +
                ".code-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }" +
                ".code-label { color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }" +
                ".code-display { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); border-radius: 16px; padding: 30px; display: inline-block; position: relative; z-index: 1; }" +
                ".code { font-size: 48px; font-weight: 800; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
                ".expiry-info { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 25px; color: rgba(255,255,255,0.95); font-size: 15px; position: relative; z-index: 1; }" +
                ".expiry-info svg { width: 20px; height: 20px; fill: #ffffff; }" +
                ".info-box { background: #f7fafc; border-left: 4px solid #667eea; border-radius: 12px; padding: 25px; margin: 35px 0; }" +
                ".info-box p { color: #2d3748; font-size: 15px; line-height: 1.7; margin: 8px 0; }" +
                ".info-box strong { color: #1a202c; font-weight: 600; }" +
                ".features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 40px 0; }" +
                ".feature-item { background: #f8fafc; border-radius: 12px; padding: 25px 20px; text-align: center; transition: transform 0.3s ease; }" +
                ".feature-icon { font-size: 32px; margin-bottom: 12px; }" +
                ".feature-item h3 { color: #2d3748; font-size: 16px; font-weight: 600; margin-bottom: 8px; }" +
                ".feature-item p { color: #718096; font-size: 14px; line-height: 1.5; }" +
                ".cta-section { text-align: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%); border-radius: 16px; }" +
                ".cta-section p { color: #4a5568; font-size: 15px; margin-bottom: 8px; }" +
                ".help-link { color: #667eea; text-decoration: none; font-weight: 600; }" +
                ".help-link:hover { text-decoration: underline; }" +
                ".footer { background: #f8f9fa; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0; }" +
                ".footer-logo { width: 40px; height: 40px; fill: #667eea; margin-bottom: 15px; }" +
                ".footer p { color: #718096; font-size: 14px; margin: 8px 0; line-height: 1.6; }" +
                ".footer .brand { color: #2d3748; font-weight: 600; font-size: 16px; }" +
                ".social-links { margin: 20px 0; }" +
                ".social-links a { display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-size: 13px; }" +
                "@media (max-width: 600px) { " +
                "body { padding: 20px 10px; }" +
                ".email-container { border-radius: 16px; }" +
                ".header { padding: 40px 25px; }" +
                ".header h1 { font-size: 28px; }" +
                ".content { padding: 40px 25px 35px; }" +
                ".code { font-size: 36px; letter-spacing: 8px; }" +
                ".features-grid { grid-template-columns: 1fr; gap: 15px; }" +
                ".logo-circle { width: 80px; height: 80px; }" +
                ".logo { width: 40px; height: 40px; }" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='email-wrapper'>" +
                "<div class='email-container'>" +

                "<div class='header'>" +
//                "<div class='logo-circle'>" +
//                "<svg class='logo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>" +
//                "<path fill='white' d='M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783'/>" +
//                "</svg>" +
//                "</div>" +
                "<h1>Verify Your Email</h1>" +
                "<p>Welcome to the Bookly community!</p>" +
                "</div>" +

                "<div class='content'>" +
                "<div class='welcome-text'>" +
                "<h2>You're Almost There! 📚</h2>" +
                "<p>Thanks for joining Bookly! We're excited to have you. Just one more step to unlock your personalized reading experience.</p>" +
                "</div>" +

                "<div class='code-card'>" +
                "<div class='code-label'>Your Verification Code</div>" +
                "<div class='code-display'>" +
                "<div class='code'>" + verificationCode + "</div>" +
                "</div>" +
                "<div class='expiry-info'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z'/><path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z'/></svg>" +
                "<span><strong>Expires in 24 hours</strong></span>" +
                "</div>" +
                "</div>" +

                "<div class='info-box'>" +
                "<p><strong>🔐 Keep This Code Secure</strong></p>" +
                "<p>Enter this code in the verification screen to activate your account. Never share this code with anyone — Bookly will never ask for it via email or phone.</p>" +
                "<p>If you didn't create a Bookly account, you can safely ignore this email.</p>" +
                "</div>" +

                "<div class='features-grid'>" +
                "<div class='feature-item'>" +
                "<div class='feature-icon'>📖</div>" +
                "<h3>Discover Books</h3>" +
                "<p>Browse thousands of titles across every genre</p>" +
                "</div>" +
                "<div class='feature-item'>" +
                "<div class='feature-icon'>⭐</div>" +
                "<h3>Get Recommendations</h3>" +
                "<p>Personalized suggestions just for you</p>" +
                "</div>" +
                "<div class='feature-item'>" +
                "<div class='feature-icon'>📊</div>" +
                "<h3>Track Progress</h3>" +
                "<p>Monitor your reading journey</p>" +
                "</div>" +
                "<div class='feature-item'>" +
                "<div class='feature-icon'>👥</div>" +
                "<h3>Join Discussions</h3>" +
                "<p>Connect with fellow book lovers</p>" +
                "</div>" +
                "</div>" +

                "<div class='cta-section'>" +
                "<p>Need help? We're here for you!</p>" +
                "<p>Visit our <a href='#' class='help-link'>Help Center</a> or reach out to our support team</p>" +
                "</div>" +
                "</div>" +

                "<div class='footer'>" +
                "<svg class='footer-logo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>" +
                "<path d='M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783'/>" +
                "</svg>" +
                "<p class='brand'>Bookly</p>" +
                "<p>Happy reading and happy exploring!</p>" +
                "<div class='social-links'>" +
                "<a href='#'>Twitter</a> • " +
                "<a href='#'>Instagram</a> • " +
                "<a href='#'>Facebook</a>" +
                "</div>" +
                "<p style='margin-top: 20px; font-size: 12px; color: #a0aec0;'>" +
                "This is an automated message, please do not reply.<br>" +
                "© 2024 Bookly. All rights reserved." +
                "</p>" +
                "</div>" +

                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}