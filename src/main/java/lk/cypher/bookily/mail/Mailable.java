package lk.cypher.bookily.mail;

import io.rocketbase.mail.EmailTemplateBuilder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lk.cypher.bookily.provider.MailServiceProvider;
import lk.cypher.bookily.util.ENV;

import java.util.logging.Level;
import java.util.logging.Logger;

public abstract class Mailable implements Runnable {
    private static final Logger logger = Logger.getLogger(Mailable.class.getName());

    private final MailServiceProvider mailServiceProvider;
    private final EmailTemplateBuilder.EmailTemplateConfigBuilder emailTemplateConfigBuilder;

    public Mailable() {
        this.mailServiceProvider = MailServiceProvider.getInstance();
        this.emailTemplateConfigBuilder = EmailTemplateBuilder.builder();
    }

    @Override
    public void run() {
        long startTime = System.currentTimeMillis();

        Session mailSession = mailServiceProvider.getSession();

        // Fallback to creating session if not available
        if (mailSession == null) {
            mailSession = Session.getInstance(
                    mailServiceProvider.getProperties(),
                    mailServiceProvider.getAuthenticator()
            );
        }

        MimeMessage mimeMessage = new MimeMessage(mailSession);

        try {
            // Set FROM address from environment
            String fromEmail = ENV.get("mail.from");
            String fromName = ENV.get("mail.from.name");

            if (fromEmail == null || fromEmail.isEmpty()) {
                throw new IllegalStateException("mail.from is not configured in environment");
            }

            if (fromName != null && !fromName.isEmpty()) {
                mimeMessage.setFrom(new InternetAddress(fromEmail, fromName));
            } else {
                mimeMessage.setFrom(new InternetAddress(fromEmail));
            }

            // Build the email content (implemented by subclasses)
            build(mimeMessage);

            // Validate recipients
            if (mimeMessage.getRecipients(MimeMessage.RecipientType.TO) == null ||
                    mimeMessage.getRecipients(MimeMessage.RecipientType.TO).length == 0) {
                throw new MessagingException("Email recipient cannot be empty");
            }

            // Validate subject
            if (mimeMessage.getSubject() == null || mimeMessage.getSubject().isEmpty()) {
                logger.warning("Email subject is empty");
            }

            // Send the email
            Transport.send(mimeMessage);

            long duration = System.currentTimeMillis() - startTime;
            String recipient = mimeMessage.getRecipients(MimeMessage.RecipientType.TO)[0].toString();

            logger.info(String.format("\u001B[32m✓ Email sent successfully to %s in %dms\u001B[0m",
                    recipient, duration));

        } catch (MessagingException e) {
            logger.log(Level.SEVERE, "Failed to send email: " + e.getMessage(), e);
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Unexpected error while sending email", e);
            throw new RuntimeException("Unexpected error in email sending: " + e.getMessage(), e);
        }
    }

    /**
     * Abstract method to be implemented by subclasses to build email content
     * @param message The message to build
     * @throws MessagingException if there's an error building the message
     */
    public abstract void build(Message message) throws MessagingException;

    /**
     * Abstract method to get recipient email address
     * @return recipient email address
     */
    public abstract String getTo();

    /**
     * Abstract method to get email subject
     * @return email subject
     */
    public abstract String getSubject();

    /**
     * Get the email template builder for creating styled emails
     * @return EmailTemplateConfigBuilder instance
     */
    public EmailTemplateBuilder.EmailTemplateConfigBuilder getEmailTemplateConfigBuilder() {
        return emailTemplateConfigBuilder;
    }

    /**
     * Get the mail service provider instance
     * @return MailServiceProvider instance
     */
    protected MailServiceProvider getMailServiceProvider() {
        return mailServiceProvider;
    }
}