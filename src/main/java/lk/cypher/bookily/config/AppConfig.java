package lk.cypher.bookily.config;

import org.glassfish.jersey.server.ResourceConfig;

public class AppConfig extends ResourceConfig {
    public AppConfig() {
        packages("lk.cypher.bookily.controller");
    }
}
