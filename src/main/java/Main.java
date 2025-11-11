import lk.cypher.bookily.config.AppConfig;
import lk.cypher.bookily.util.HibernateUtil;
import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.glassfish.jersey.servlet.ServletContainer;
import org.hibernate.Session;

import java.io.File;

public class Main {
    private static final int PORT = 8080;
    private static final String CONTEXT_PATH = "/bookliy";

    public static void main(String[] args) {
//        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            Tomcat tomcat = new Tomcat();
            tomcat.setPort(PORT);
            tomcat.getConnector();
            Context context = tomcat.
                    addWebapp(Main.CONTEXT_PATH, new File("src/main/webapp").getAbsolutePath());
            Tomcat.addServlet(context, "JerseyServlet", new ServletContainer(new AppConfig()));
            context.addServletMappingDecoded("/api/*", "JerseyServlet");
            tomcat.start();
            System.out.println("URL: http://localhost:" + PORT + CONTEXT_PATH);
            tomcat.getServer().await();
        } catch (LifecycleException e) {
            throw new RuntimeException("Tomcat startup failed: " + e.getMessage());
        }
    }
}
