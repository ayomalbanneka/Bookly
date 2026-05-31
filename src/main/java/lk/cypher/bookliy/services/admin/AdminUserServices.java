package lk.cypher.bookliy.services.admin;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.entity.Status;
import lk.cypher.bookliy.entity.User;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class AdminUserServices {

    public String blockUser(int userId, @Context HttpServletRequest request) {
        return updateUserStatus(userId, Status.Type.BLOCKED.toString(), request);
    }

    public String unblockUser(int userId, @Context HttpServletRequest request) {
        return updateUserStatus(userId, Status.Type.ACTIVE.toString(), request);
    }

    private String updateUserStatus(int userId, String statusValue, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        if (userId <= 0) {
            message = "Invalid user Id.";
        } else {
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null || httpSession.getAttribute("admin") == null) {
                message = "Session is invalid. Please login again.";
            } else {
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                Transaction transaction = hibernateSession.beginTransaction();
                try {
                    User user = hibernateSession.find(User.class, userId);
                    if (user == null) {
                        message = "User not found.";
                    } else {
                        Status statusEntity = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                                .setParameter("value", statusValue)
                                .getSingleResultOrNull();
                        if (statusEntity == null) {
                            message = "Status not configured.";
                        } else {
                            user.setStatus(statusEntity);
                            hibernateSession.merge(user);
                            transaction.commit();
                            status = true;
                            message = "User status updated successfully.";
                        }
                    }
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Failed to update user status. Please try again.";
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
}

