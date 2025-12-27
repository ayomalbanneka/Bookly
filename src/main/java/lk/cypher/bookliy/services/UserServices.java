package lk.cypher.bookliy.services;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.dto.UserDTO;
import lk.cypher.bookliy.entity.Status;
import lk.cypher.bookliy.entity.User;
import lk.cypher.bookliy.mail.VerificationMail;
import lk.cypher.bookliy.provider.MailServiceProvider;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserServices {
    private static final Gson GSON = new Gson();

    public String addNewUser(UserDTO userDTO) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message;
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
        } else if (!userDTO.getEmail().matches(Validator.EMAIL_VALIDATION)) {
            message = "Please provide valid email address.";
        } else if (!userDTO.getPassword().matches(Validator.PASSWORD_VALIDATION)) {
            message = "Please provide valid password. \n" +
                    "The password must containes at least one capita letter, one simple letter," +
                    "one digit, one special character and password must be greater than 8 characters";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession(); // Open Hibernate session
            User singleUser = hibernateSession.createNamedQuery("user.getByEmail", User.class)
                    .setParameter("email", userDTO.getEmail())
                    .getSingleResultOrNull(); // Check if email already registered

            if (singleUser != null) { // Already email registered
                message = "This email is already registered. Please use another email.";
            } else {
                User u = new User();
                u.setFirstName(userDTO.getFirstName());
                u.setLastName(userDTO.getLastName());
                u.setEmail(userDTO.getEmail());
                u.setPassword(userDTO.getPassword());

                String verificationCode = AppUtil.generateCode(); // Generate verification code
                u.setVerificationCode(verificationCode); // Set verification code to user

                Status pendingStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                        .setParameter("value", String.valueOf(Status.Type.PENDING)).getSingleResult(); // Get pending status

                u.setStatus(pendingStatus);

                Transaction transaction = hibernateSession.beginTransaction();

                try {
                    hibernateSession.persist(u);
                    transaction.commit();

                    status = true;
                    responseObject.addProperty("uId", u.getId());
                    message = "Account created successfully. Please check your email for verification code.";

                    // Verification Mail Sending Algorithm
                    VerificationMail verificationMail = new VerificationMail(u.getEmail(), verificationCode);
                    MailServiceProvider.getInstance().sendMail(verificationMail);

                } catch (Exception e) {
                    transaction.rollback();
                    message = "Failed to register user. Please try again.";
                }
            }
            hibernateSession.close();
        }
        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    public String userLogin(UserDTO userDTO, @Context HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        if (userDTO.getEmail() == null || userDTO.getEmail().isBlank()) {
            message = "Email is required!";
        } else if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
            message = "Password is required!";
        } else if (!userDTO.getEmail().matches(Validator.EMAIL_VALIDATION)) {
            message = "Please provide valid email address.";
        } else if (!userDTO.getPassword().matches(Validator.PASSWORD_VALIDATION)) {
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
//                        System.out.println("Logged in user: " + singleUser.getEmail());
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

    public String verifyAccount(UserDTO userDTO) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        // Validation Checks
        if (userDTO.getVerificationCode() == null) {
            message = "Verification code is required!";
        } else if (userDTO.getEmail() == null) {
            message = "Email is required";
        } else if (userDTO.getEmail().isBlank()) {
            message = "Email cannot be empty or blank";
        } else if (!userDTO.getEmail().matches(Validator.EMAIL_VALIDATION)) {
            message = "Please provide valid email address.";
        } else if (userDTO.getVerificationCode().isBlank()) {
            message = "Verification code cannot be empty or blank";
        } else if (!userDTO.getVerificationCode().matches(Validator.VERIFICATION_CODE_VALIDATION)) {
            message = "Please provide valid verification code. Verification code must be 6 digits.";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            User user = hibernateSession.createQuery("FROM User u WHERE u.email=:email AND u.verificationCode=:code", User.class)
                    .setParameter("email", userDTO.getEmail())
                    .setParameter("code", userDTO.getVerificationCode())
                    .getSingleResultOrNull(); // Check user by email and verification code
            if (user == null) {
                message = "Account not fount. Please register first.";
            } else {
                Status verifiedStatus = hibernateSession.createNamedQuery("Status.findByValue", Status.class)
                        .setParameter("value", String.valueOf(Status.Type.VERIFIED))
                        .getSingleResult();

                if (user.getStatus().equals(verifiedStatus)) {
                    message = "Account is already verified. Please login to continue.";
                } else {
                    user.setStatus(verifiedStatus);
                    user.setVerificationCode(""); // Clear verification code after successful verification
                    Transaction transaction = hibernateSession.beginTransaction();
                    try {
                        hibernateSession.merge(user);
                        transaction.commit();
                        status = true;
                        message = "Account verified successfully. You can now login to your account.";
                    } catch (Exception e) {
                        transaction.rollback();
                        message = "Failed to verify account. Please try again.";
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
