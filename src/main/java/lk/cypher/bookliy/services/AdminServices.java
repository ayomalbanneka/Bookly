package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.dto.AdminDTO;
import lk.cypher.bookliy.entity.Admin;
import lk.cypher.bookliy.entity.Status;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;

public class AdminServices {
    public String adminLogin(AdminDTO adminDTO, @Context HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        if (adminDTO.getEmail() == null || adminDTO.getEmail().isEmpty()) {
            message = "Email is required!";
        } else if (adminDTO.getPassword() == null || adminDTO.getPassword().isBlank()) {
            message = "Password is required!";
        } else if (!adminDTO.getEmail().matches(Validator.EMAIL_VALIDATION)) {
            message = "Please provide valid email address.";
        } else if (!adminDTO.getPassword().matches(Validator.PASSWORD_VALIDATION)) {
            message = "Please provide valid password. \n" +
                    "The password must containes at least one capita letter, one simple letter," +
                    "one digit, one special character and password must be greater than 8 characters";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Admin singleAdmin = hibernateSession.createNamedQuery("admin.getByEmail", Admin.class)
                    .setParameter("email", adminDTO.getEmail())
                    .getSingleResultOrNull();

            if (singleAdmin == null) {
                message = "Account not found. Please try again.";
            } else {
                if (!singleAdmin.getPassword().equals(adminDTO.getPassword())) {
                    message = "Invalid email or password. Please try again.";
                } else {
                    Status verifyStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                            .setParameter("value", String.valueOf(Status.Type.APPROVED))
                            .getSingleResultOrNull();
                    if (!singleAdmin.getStatus().equals(verifyStatus)) {
                        message = "Account is still under the review process. Please try again later.";
                    } else {
                        HttpSession httpSession = request.getSession();
                        httpSession.setAttribute("admin", singleAdmin);
                        status = true;
                        message = "Login successful.";
                    }
                }
            }
            hibernateSession.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }
}
