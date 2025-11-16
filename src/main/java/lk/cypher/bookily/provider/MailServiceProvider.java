package lk.cypher.bookily.provider;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lk.cypher.bookily.mail.Mailable;
import lk.cypher.bookily.util.ENV;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.concurrent.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MailServiceProvider {
    private static final Logger logger = Logger.getLogger(MailServiceProvider.class.getName());

    private ThreadPoolExecutor executor;
    private Authenticator authenticator;
    private Session session;
    private final BlockingQueue<Runnable> blockingQueue = new LinkedBlockingQueue<>();
    private final Properties properties = new Properties();
    private static MailServiceProvider mailServiceProvider;

    // Shutdown hook for graceful shutdown
    private final Thread shutdownHook = new Thread(this::shutdown);

    private MailServiceProvider() {
        // SMTP Configuration
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", ENV.get("mail.host"));
        properties.put("mail.smtp.port", ENV.get("mail.port"));
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2");
        properties.put("mail.smtp.connectiontimeout", "10000"); // 10 seconds
        properties.put("mail.smtp.timeout", "10000");
        properties.put("mail.smtp.writetimeout", "10000");

        // Add shutdown hook
        Runtime.getRuntime().addShutdownHook(shutdownHook);
    }

    public static synchronized MailServiceProvider getInstance() {
        if (mailServiceProvider == null) {
            mailServiceProvider = new MailServiceProvider();
        }
        return mailServiceProvider;
    }

    public void start() {
        // Initialize authenticator
        authenticator = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                        ENV.get("mail.username"),
                        ENV.get("mail.password")
                );
            }
        };

        // Create mail session
        session = Session.getInstance(properties, authenticator);
        session.setDebug(false); // Set to true for debugging

        // Initialize thread pool executor
        executor = new ThreadPoolExecutor(
                2,                              // Core pool size
                5,                              // Maximum pool size
                60,                             // Keep alive time
                TimeUnit.SECONDS,               // Time unit
                blockingQueue,                  // Work queue
                new ThreadFactory() {           // Custom thread factory
                    private int counter = 0;

                    @Override
                    public Thread newThread(Runnable r) {
                        Thread thread = new Thread(r, "MailService-Worker-" + counter++);
                        thread.setDaemon(false);
                        return thread;
                    }
                },
                new ThreadPoolExecutor.CallerRunsPolicy() // Rejection policy
        );

        executor.prestartCoreThread();

        logger.info("\u001B[32m✓ Email Service Initialized Successfully\u001B[0m");
        logger.info("Mail Host: " + ENV.get("mail.host"));
        logger.info("Mail Port: " + ENV.get("mail.port"));
        logger.info("Thread Pool: Core=2, Max=5");
    }

    /**
     * Send email using Mailable object
     */
    public void sendMail(Mailable mailable) {
        if (executor == null || executor.isShutdown()) {
            logger.severe("Email service is not started or has been shut down!");
            return;
        }

        Runnable emailTask = () -> {
            try {
                sendEmailSync(mailable);
            } catch (Exception e) {
                logger.log(Level.SEVERE, "Failed to send email to: " + mailable.getTo(), e);
            }
        };

        try {
            boolean offered = blockingQueue.offer(emailTask, 5, TimeUnit.SECONDS);
            if (!offered) {
                logger.warning("Email queue is full. Email to " + mailable.getTo() + " was rejected.");
            } else {
                logger.info("Email queued for: " + mailable.getTo());
            }
        } catch (InterruptedException e) {
            logger.log(Level.WARNING, "Interrupted while queuing email", e);
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Send email using Runnable (legacy support)
     */
    public void sendMail(Runnable mailable) {
        if (executor == null || executor.isShutdown()) {
            logger.severe("Email service is not started or has been shut down!");
            return;
        }

        try {
            boolean offered = blockingQueue.offer(mailable, 5, TimeUnit.SECONDS);
            if (!offered) {
                logger.warning("Email queue is full. Email task was rejected.");
            }
        } catch (InterruptedException e) {
            logger.log(Level.WARNING, "Interrupted while queuing email", e);
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Synchronously send email
     */
    private void sendEmailSync(Mailable mailable) throws MessagingException {
        long startTime = System.currentTimeMillis();

        Message message = new MimeMessage(session);
        try {
            message.setFrom(new InternetAddress(ENV.get("mail.from"), ENV.get("mail.from.name")));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        // Let the mailable build the message
        mailable.build(message);

        // Send the message
        Transport.send(message);

        long duration = System.currentTimeMillis() - startTime;
        logger.info(String.format("✓ Email sent successfully to %s in %dms",
                mailable.getTo(), duration));
    }

    /**
     * Get current queue size
     */
    public int getQueueSize() {
        return blockingQueue.size();
    }

    /**
     * Get active thread count
     */
    public int getActiveThreadCount() {
        return executor != null ? executor.getActiveCount() : 0;
    }

    /**
     * Get total completed tasks
     */
    public long getCompletedTaskCount() {
        return executor != null ? executor.getCompletedTaskCount() : 0;
    }

    /**
     * Graceful shutdown
     */
    public void shutdown() {
        if (executor != null && !executor.isShutdown()) {
            logger.info("Shutting down Email Service...");

            executor.shutdown();

            try {
                // Wait for existing tasks to complete
                if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
                    logger.warning("Email tasks did not complete in time. Forcing shutdown...");
                    executor.shutdownNow();

                    // Wait again for tasks to respond to cancellation
                    if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
                        logger.severe("Email service did not terminate cleanly.");
                    }
                }

                logger.info("\u001B[32m✓ Email Service Stopped Successfully\u001B[0m");
                logger.info("Total emails sent: " + getCompletedTaskCount());

            } catch (InterruptedException e) {
                logger.warning("Shutdown interrupted. Forcing immediate shutdown.");
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        // Remove shutdown hook if shutdown was called manually
        try {
            Runtime.getRuntime().removeShutdownHook(shutdownHook);
        } catch (IllegalStateException e) {
            // Shutdown already in progress
        }
    }

    public Properties getProperties() {
        return properties;
    }

    public Authenticator getAuthenticator() {
        return authenticator;
    }

    public Session getSession() {
        return session;
    }
}