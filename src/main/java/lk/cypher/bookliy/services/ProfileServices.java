package lk.cypher.bookliy.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.dto.UserDTO;
import lk.cypher.bookliy.entity.Address;
import lk.cypher.bookliy.entity.User;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ProfileServices {
    public String userProfile(@Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        //user-profile data loading logic
        HttpSession httpSession = request.getSession(false);
        User user = (User) httpSession.getAttribute("user");

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
//        userDTO.setPassword(user.getPassword());
        userDTO.setEmail(user.getEmail());

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        List<Address> addressList = hibernateSession.createQuery("from Address a where a.user = :user", Address.class)
                .setParameter("user", user)
                .getResultList();

        // Convert ALL addresses to JSON array
        JsonArray addressesArray = new JsonArray();
        for (Address address : addressList) {
            JsonObject addrObj = new JsonObject();
            addrObj.addProperty("id", address.getId());
            addrObj.addProperty("lineOne", address.getLine1());
            addrObj.addProperty("lineTwo", address.getLine2());
            addrObj.addProperty("postalCode", address.getPostalCode());
            addrObj.addProperty("mobile", address.getMobile());
            addrObj.addProperty("isPrimary", address.isPrimary());
            addrObj.addProperty("cityId", address.getCity().getId());
            addrObj.addProperty("cityName", address.getCity().getName());
            addressesArray.add(addrObj);
        }

        Address primaryAddress = null;
        for (Address address : addressList) { // Find primary address
            if (address.isPrimary()) { // If primary
                primaryAddress = address; // Set as primary
                break;
            }
        }

        if (primaryAddress != null) {
            userDTO.setLineOne(primaryAddress.getLine1());
            userDTO.setLineTwo(primaryAddress.getLine2());
            userDTO.setPostalCode(primaryAddress.getPostalCode());
            userDTO.setMobile(primaryAddress.getMobile());
            userDTO.setPrimary(primaryAddress.isPrimary());
            userDTO.setCityId(primaryAddress.getCity().getId());
            userDTO.setCityName(primaryAddress.getCity().getName());
        }

        LocalDateTime createdAt = user.getCreatedAt();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MMMM");
        String sinceAt = createdAt.format(formatter);
        userDTO.setSinceAt(sinceAt);

        responseObj.add("user", AppUtil.gson.toJsonTree(userDTO));
        responseObj.add("addresses", addressesArray);
        hibernateSession.close();
        status = true;
        message = "User profile loaded successfully.";
        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    public String updateProfile(UserDTO userDTO, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        //update-profile logic
        if (userDTO.getFirstName() == null) {
            message = "First name is required.";
        } else if (userDTO.getFirstName().isBlank()) {
            message = "First name cannot be empty.";
        } else if (userDTO.getLastName() == null) {
            message = "Last name is required.";
        } else if (userDTO.getLastName().isBlank()) {
            message = "Last name cannot be empty.";
        } else if (userDTO.getMobile() == null) {
            message = "Mobile is required.";
        } else if (userDTO.getMobile().isBlank()) {
            message = "Mobile is cannot be empty.";
        } else if (userDTO.getMobile().equals(Validator.MOBILE_VALIDATION)) {
            message = "Please provide a valid mobile number.";
        } else {
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null) {
                message = "Session expired. Please log in again.";
            } else {
                User sessionUser = (User) httpSession.getAttribute("user");
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                User dbUser = hibernateSession.createNamedQuery("user.getByEmail", User.class)
                        .setParameter("email", sessionUser.getEmail())
                        .uniqueResult();

                Address addressDb = hibernateSession.createQuery("from Address a where a.user = :user and a.isPrimary = true", Address.class)
                        .setParameter("user", dbUser)
                        .uniqueResult();

                dbUser.setFirstName(userDTO.getFirstName());
                dbUser.setLastName(userDTO.getLastName());
                addressDb.setMobile(userDTO.getMobile());

                Transaction transaction = hibernateSession.beginTransaction();

                try {
                    hibernateSession.merge(dbUser);
                    hibernateSession.merge(addressDb);
                    transaction.commit();
                    // Update session user
                    httpSession.setAttribute("user", dbUser);
                    status = true;
                    message = "Profile updated successfully.";
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Failed to update profile. Please try again.";
                }
                hibernateSession.close();
            }
        }
        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }
}
