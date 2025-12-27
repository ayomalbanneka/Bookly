package lk.cypher.bookly.config;

import org.glassfish.jersey.server.ResourceConfig;

public class AppConfig extends ResourceConfig {
    public AppConfig() {
        packages("lk.cypher.bookliy.controller");
        packages("lk.cypher.bookliy.middleware");
    }
}
