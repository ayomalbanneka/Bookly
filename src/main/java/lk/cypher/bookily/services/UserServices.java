package lk.cypher.bookily.services;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookily.dto.UserDTO;
import lk.cypher.bookily.entity.Status;
import lk.cypher.bookily.entity.User;
import lk.cypher.bookily.util.AppUtil;
import lk.cypher.bookily.util.HibernateUtil;
import lk.cypher.bookily.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserServices {
    private static final Gson GSON = new Gson();

    public String addNewUser(UserDTO userDTO) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";
        if (userDTO.getFirstName() == null) {
            message = "First Name is Required";
        } else if (userDTO.getFirstName().isBlank()) {
            message = "First name cannot be empty or blank";
        } else if (userDTO.getLastName() == null) {
            message = "Last name is required!";
        } else if (userDTO.getLastName().isBlank()) {
            message = "Last name cannot be empty or blank";
        } else if (userDTO.getEmail() == null) {
            message = "Email is required!";
        } else if (userDTO.getEmail().isBlank()) {
            message = "Email cannot be empty or blank";
        } else if (userDTO.getPassword() == null) {
            message = "Password is required!";
        } else if (userDTO.getEmail().matches(Validator.EMAIL_VALIDATION)) {
            message = "Please provide valid email address.";
        } else if (userDTO.getPassword().matches(Validator.PASSWORD_VALIDATION)) {
            message = "Please provide valid password. \n" +
                    "The password must containes at least one capita letter, one simple letter," +
                    "one digit, one special character and password must be greater than 8 characters";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            User singleUser = hibernateSession.createNamedQuery("user.getByEmail", User.class)
                    .setParameter("email", userDTO.getEmail())
                    .getSingleResultOrNull();

            if (singleUser != null) { // Already email registered
                message = "This email is already registered. Please use another email.";
            } else {
                User u = new User();
                u.setFirstName(userDTO.getFirstName());
                u.setLastName(userDTO.getLastName());
                u.setEmail(userDTO.getEmail());
                u.setPassword(userDTO.getPassword());

                String verificationCode = AppUtil.generateCode();
                u.setVerificationCode(verificationCode);

                Status pendingStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                        .setParameter("value", String.valueOf(Status.Type.PENDING)).getSingleResult();

                u.setStatus(pendingStatus);

                Transaction transaction = hibernateSession.beginTransaction();

                try {
                    hibernateSession.persist(u);
                    transaction.commit();

                    status = true;
                    responseObject.addProperty("uId", u.getId());
                    message = "Account created successfully. Please check your email for verification code.";

                    // Verification Mail Sending Algorithm


                } catch (Exception e) {
                    transaction.rollback();
                    message = "Failed to register user. Please try again.";
                }
            }
            hibernateSession.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return responseObject.toString();
    }

    public String userLogin(UserDTO userDTO, @Context HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        if (userDTO.getEmail() == null || userDTO.getEmail().isBlank()) {
            message = "Email is required!";
        } else if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
            message = "Password is required!";
        } else if (userDTO.getEmail().matches(Validator.EMAIL_VALIDATION)) {
            message = "Please provide valid email address.";
        } else if (userDTO.getPassword().matches(Validator.PASSWORD_VALIDATION)) {
            message = "Please provide valid password. \n" +
                    "The password must containes at least one capita letter, one simple letter," +
                    "one digit, one special character and password must be greater than 8 characters";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            User singleUser = hibernateSession.createNamedQuery("user.getByEmail", User.class)
                    .setParameter("email", userDTO.getEmail())
                    .getSingleResultOrNull();

            if (singleUser == null) { //User not found
                message = "Account not fount. Please register first.";
            } else {
                if (!singleUser.getPassword().equals(userDTO.getPassword())) {
                    message = "Something went wrong. Please check your login credentials!.";
                } else {
                    Status verifyStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                            .setParameter("value", String.valueOf(Status.Type.VERIFIED))
                            .getSingleResult();
                    if (!singleUser.getStatus().equals(verifyStatus)) {
                        message = "Account is not verified. Please verify your account to login.";
                    } else {
                        HttpSession HttpSession = request.getSession();
                        HttpSession.setAttribute("user", singleUser);
                        status = true;
                        message = "Login successful.";
                    }
                }
            }
            hibernateSession.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return responseObject.toString();
    }
}
