package lk.cypher.bookliy.listener;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import lk.cypher.bookliy.provider.MailServiceProvider;

@WebListener
public class ContextPathListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("🚀 Starting Mail Service Provider...");
        MailServiceProvider.getInstance().start();
        System.out.println("✅ Mail Service Provider started successfully.");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("🛑 Shutting down Mail Service Provider...");
        MailServiceProvider.getInstance().shutdown();
        System.out.println("✅ Mail Service Provider shut down successfully.");
    }
}
