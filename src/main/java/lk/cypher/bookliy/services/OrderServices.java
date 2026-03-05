package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.mail.OrderConfirmationMail;
import lk.cypher.bookliy.provider.MailServiceProvider;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class OrderServices {
    // Create a pending order for the user
    public Order createPendingOrder(User user, Session session) {
        try {
            // Get user's cart items FIRST
            List<Cart> cartItems = session.createQuery(
                            "FROM Cart c WHERE c.user.id = :userId",
                            Cart.class)
                    .setParameter("userId", user.getId())
                    .getResultList();

            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cannot create order: Cart is empty");
            }

            System.out.println("Found " + cartItems.size() + " cart items for user: " + user.getId());

            // Get or create a default delivery type
            DeliveryType deliveryType = session.createQuery("FROM DeliveryType WHERE id = :id", DeliveryType.class)
                    .setParameter("id", 1)
                    .getSingleResultOrNull();

            if (deliveryType == null) {
                throw new RuntimeException("Default delivery type not found. Please ensure delivery types are configured.");
            }

            // Get pending status
            Status pendingStatus = session.createQuery(
                            "FROM Status WHERE value = :value",
                            Status.class
                    )
                    .setParameter("value", "Pending")
                    .getSingleResultOrNull();

            if (pendingStatus == null) {
                throw new RuntimeException("Pending status not found. Please ensure order statuses are configured.");
            }

            // Create the order
            Order order = new Order();
            order.setUser(user);
            order.setStatus(pendingStatus);
            order.setDeliveryType(deliveryType);

            session.persist(order);
//            session.flush(); // Ensure ID is generated

            System.out.println("Created order with ID: " + order.getId());

            // CREATE ORDER ITEMS FROM CART
            for (Cart cartItem : cartItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setStock(cartItem.getStock());
                orderItem.setQty(cartItem.getQty());
                orderItem.setRating(0);

                session.persist(orderItem);
            }

            session.flush(); // Flush order items to database

            return order;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    // Complete the order after successful payment
    public void completeOrder(String orderId) {
        int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

        try (Session hibernateSession = HibernateUtil.getSessionFactory().openSession()) {
            Transaction transaction = hibernateSession.beginTransaction();
            try {
                Order order = hibernateSession.find(Order.class, oId);
                if (order == null) {
                    throw new RuntimeException("Order not found for Order ID: " + oId);
                }
                // update stock quantity
                List<OrderItem> orderItems = order.getOrderItems();
                if (orderItems != null && !orderItems.isEmpty()) {
                    for (OrderItem orderItem : orderItems) {
                        Stock stock = orderItem.getStock();
                        int updatedQty = stock.getQty() - orderItem.getQty();
                        if (updatedQty < 0) {
                            throw new RuntimeException("Insufficient stock for product: " + stock.getProduct().getTitle());
                        }
                        stock.setQty(updatedQty);
                        hibernateSession.merge(stock);
                    }
                }

                // update order status
                Status completedStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                        .setParameter("value", String.valueOf(Status.Type.COMPLETED))
                        .getSingleResult();
                order.setStatus(completedStatus);
                hibernateSession.merge(order);

                // remove cart items
                List<Cart> cartList = hibernateSession.createQuery("FROM Cart c WHERE c.user=:user", Cart.class)
                        .setParameter("user", order.getUser())
                        .getResultList();
                for (Cart cart : cartList) {
                    hibernateSession.remove(cart); // completely remove from db
                }
                transaction.commit();

                // Send order confirmation email
                try {
                    OrderConfirmationMail confirmationMail = new OrderConfirmationMail(order);
                    MailServiceProvider.getInstance().sendMail(confirmationMail);
                    System.out.println("Order confirmation email queued for order ID: " + oId);
                } catch (Exception emailEx) {
                    // Don't fail the order if email sending fails
                    System.err.println("Failed to send order confirmation email for order ID: " + oId + " - " + emailEx.getMessage());
                }
            } catch (HibernateException e) {
                transaction.rollback();
                throw new RuntimeException("Failed to complete order: " + e.getMessage(), e);
            }
        }
    }

    // Mark the order as failed
    public void failedOrder(String orderId) {
        int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));
        try (Session hibernateSession = HibernateUtil.getSessionFactory().openSession()) {
            Transaction transaction = hibernateSession.beginTransaction();
            try {
                Order order = hibernateSession.find(Order.class, oId);
                if (order == null) {
                    throw new RuntimeException("Order not found for Order Id: " + oId);
                }

                // Update Order Status to FAILED
                Status failedStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                        .setParameter("value", String.valueOf(Status.Type.REJECTED))
                        .getSingleResult();
                order.setStatus(failedStatus);
                hibernateSession.merge(order);

                transaction.commit();
            }catch (HibernateException e) {
                transaction.rollback();
                throw new RuntimeException("Failed marking order as failed: " + e.getMessage());
            }
        }
    }

    // Verify order details
    public String verifyOrderDetails(String orderId){
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";
        int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN,""));
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Order order = hibernateSession.find(Order.class, oId);
        if(order==null){
            message="Incorrect order details. Please check credentials!";
        }else{
            if(order.getStatus().getValue().equals(String.valueOf(Status.Type.COMPLETED))){
                status=true;
            }
        }
        hibernateSession.close();
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Complete the order after client-side payment confirmation and verify it
    public String completeAndVerify(String orderId) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        try {
            int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

            try (Session hibernateSession = HibernateUtil.getSessionFactory().openSession()) {
                Order order = hibernateSession.find(Order.class, oId);
                if (order == null) {
                    message = "Incorrect order details. Please check credentials!";
                } else if (order.getStatus().getValue().equals(String.valueOf(Status.Type.COMPLETED))) {
                    // Already completed (e.g., notify URL already processed it)
                    status = true;
                    message = "Order already completed.";
                } else {
                    // Order is still pending, complete it now
                    completeOrder(orderId);
                    status = true;
                    message = "Order completed successfully.";
                }
            }
        } catch (Exception e) {
            message = "Failed to complete order: " + e.getMessage();
            e.printStackTrace();
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }
}
