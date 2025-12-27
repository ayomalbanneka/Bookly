import lk.cypher.bookly.util.HibernateUtil;
import org.hibernate.Session;

public class Test {
    public static void main(String[] args) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        System.out.println(session);
    }
}
