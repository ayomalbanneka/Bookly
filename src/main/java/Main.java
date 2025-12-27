import lk.cypher.bookly.config.AppConfig;
import lk.cypher.bookly.listener.ContextPathListener;
import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.glassfish.jersey.servlet.ServletContainer;

import java.io.File;

public class Main {
    private static final int PORT = 8080;
    private static final String CONTEXT_PATH = "/bookliy";

    public static void main(String[] args) {
        try {
            Tomcat tomcat = new Tomcat();
            tomcat.setPort(PORT);
            tomcat.getConnector();
            Context context = tomcat.
                    addWebapp(Main.CONTEXT_PATH, new File("src/main/webapp").getAbsolutePath());
            Tomcat.addServlet(context, "JerseyServlet", new ServletContainer(new AppConfig()));
            context.addServletMappingDecoded("/api/*", "JerseyServlet");

            context.addApplicationListener(ContextPathListener.class.getName()); // Add Context Path Listener

            tomcat.start();
            System.out.println("URL: http://localhost:" + PORT + CONTEXT_PATH);
            tomcat.getServer().await();
        } catch (LifecycleException e) {
            throw new RuntimeException("Tomcat startup failed: " + e.getMessage());
        }
    }
}
