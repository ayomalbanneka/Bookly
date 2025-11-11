package lk.cypher.bookily.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ENV {
    private static final Properties APP_PROPERTIES = new Properties();

    static {
        try {
            InputStream inputStream = ENV.class.getClassLoader().getResourceAsStream("app.properties");
            APP_PROPERTIES.load(inputStream);
        } catch (IOException e) {
            throw new RuntimeException("Application properties file loading failed: " + e.getMessage());
        }
    }

    public static String get(String key) {
        return APP_PROPERTIES.getProperty(key);
    }

    public static Properties getAppProperties(){
        return APP_PROPERTIES;
    }
}
