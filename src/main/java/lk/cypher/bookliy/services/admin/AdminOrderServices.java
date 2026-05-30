package lk.cypher.bookliy.services.admin;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.entity.Order;
import lk.cypher.bookliy.entity.Status;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class AdminOrderServices {

    public String updateOrderStatus(String orderId, String newStatus, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        if (orderId == null || orderId.isBlank()) {
            message = "Order Id is required.";
        } else if (newStatus == null || newStatus.isBlank()) {
            message = "Order status is required.";
        } else {
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null || httpSession.getAttribute("admin") == null) {
                message = "Session is invalid. Please login again.";
            } else {
                int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                Transaction transaction = hibernateSession.beginTransaction();
                try {
                    Order order = hibernateSession.find(Order.class, oId);
                    if (order == null) {
                        message = "Order not found.";
                    } else {
                        Status statusEntity = resolveStatus(hibernateSession, newStatus);
                        if (statusEntity == null) {
                            message = "Status not configured.";
                        } else {
                            order.setStatus(statusEntity);
                            hibernateSession.merge(order);
                            transaction.commit();
                            status = true;
                            message = "Order status updated successfully.";
                        }
                    }
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Failed to update order status. Please try again.";
                    e.printStackTrace();
                } finally {
                    hibernateSession.close();
                }
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    private Status resolveStatus(Session session, String statusValue) {
        String normalized = statusValue.trim();
        Status status = session.createNamedQuery("Status.findByValue", Status.class)
                .setParameter("value", normalized)
                .getSingleResultOrNull();
        if (status != null) {
            return status;
        }
        String upper = normalized.toUpperCase();
        status = session.createNamedQuery("Status.findByValue", Status.class)
                .setParameter("value", upper)
                .getSingleResultOrNull();
        if (status != null) {
            return status;
        }
        if ("PROCESSING".equals(upper)) {
            return session.createNamedQuery("Status.findByValue", Status.class)
                    .setParameter("value", Status.Type.PACKING.toString())
                    .getSingleResultOrNull();
        }
        return null;
    }
}

