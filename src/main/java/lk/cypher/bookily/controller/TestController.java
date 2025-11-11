package lk.cypher.bookily.controller;

import lk.cypher.bookily.entity.Status;
import lk.cypher.bookily.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

public class TestController {
    public static void main(String[] args) {
//        // Open Hibernate session
//        Session session = HibernateUtil.getSessionFactory().openSession();
//        Transaction transaction = session.beginTransaction();
//
//        try {
//            // Loop through all enum values
//            for (Status.Type type : Status.Type.values()) {
//                String value = type.name();
//
//                // Check if this value already exists
//                Query<Status> query = session.createNamedQuery("Status.findByValue", Status.class);
//                query.setParameter("value", value);
//                Status existing = query.uniqueResult();
//
//                // If not found, insert it
//                if (existing == null) {
//                    Status status = new Status();
//                    status.setValue(value);
//                    session.persist(status);
//                    System.out.println("Inserted: " + value);
//                } else {
//                    System.out.println("Already exists: " + value);
//                }
//            }
//
//            // Commit transaction
//            transaction.commit();
//            System.out.println("✅ Status table seeded successfully!");
//
//        } catch (Exception e) {
//            if (transaction != null) transaction.rollback();
//            e.printStackTrace();
//        }
    }
}
