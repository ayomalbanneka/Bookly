package lk.cypher.bookliy.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.core.Context;
import lk.cypher.bookliy.dto.UserDTO;
import lk.cypher.bookliy.entity.Address;
import lk.cypher.bookliy.entity.City;
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

    public String addNewAddress(String jsonData, HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";
        Session hibernateSession = null;
        Transaction transaction = null;

        try {
            // Parse JSON data
            JsonObject addressJson = AppUtil.gson.fromJson(jsonData, JsonObject.class);

            String line1 = addressJson.has("line1") ? addressJson.get("line1").getAsString() : null;
            String line2 = addressJson.has("line2") ? addressJson.get("line2").getAsString() : null;
            int cityId = addressJson.has("cityId") ? addressJson.get("cityId").getAsInt() : 0;
            String postalCode = addressJson.has("postalCode") ? addressJson.get("postalCode").getAsString() : null;
            String mobile = addressJson.has("mobile") ? addressJson.get("mobile").getAsString() : null;
            boolean isDefault = addressJson.has("isDefault") && addressJson.get("isDefault").getAsBoolean();

            // Validation
            if (line1 == null || line1.trim().isEmpty()) {
                message = "Address Line 1 is required.";
            } else if (line2 == null || line2.trim().isEmpty()) {
                message = "Address Line 2 is required.";
            } else if (cityId <= 0) {
                message = "Please select a city.";
            } else if (postalCode == null || postalCode.trim().isEmpty()) {
                message = "Postal code is required.";
            } else if (mobile == null || mobile.trim().isEmpty()) {
                message = "Mobile number is required.";
            } else if (!mobile.matches("^[0-9]{10}$")) {
                message = "Please provide a valid 10-digit mobile number.";
            } else {
                hibernateSession = HibernateUtil.getSessionFactory().openSession();

                // Get logged in user from session
                HttpSession httpSession = request.getSession(false);
                if (httpSession == null) {
                    message = "Session expired. Please login again.";
                    responseObj.addProperty("status", status);
                    responseObj.addProperty("message", message);
                    return AppUtil.gson.toJson(responseObj);
                }

                User sessionUser = (User) httpSession.getAttribute("user");
                if (sessionUser == null) {
                    message = "User not found in session. Please login again.";
                    responseObj.addProperty("status", status);
                    responseObj.addProperty("message", message);
                    return AppUtil.gson.toJson(responseObj);
                }

                // Get user from database
                User dbUser = hibernateSession.createNamedQuery("user.getByEmail", User.class)
                        .setParameter("email", sessionUser.getEmail())
                        .uniqueResult();

                if (dbUser == null) {
                    message = "User not found in database.";
                    responseObj.addProperty("status", status);
                    responseObj.addProperty("message", message);
                    return AppUtil.gson.toJson(responseObj);
                }

                // Get city from database
                City city = hibernateSession.find(City.class, cityId);
                if (city == null) {
                    message = "Invalid city selected.";
                    responseObj.addProperty("status", status);
                    responseObj.addProperty("message", message);
                    return AppUtil.gson.toJson(responseObj);
                }

                transaction = hibernateSession.beginTransaction();

                // If this is set as default, unset other default addresses
                if (isDefault) {
                    hibernateSession.createQuery(
                                    "UPDATE Address SET isPrimary = false WHERE user.id = :userId")
                            .setParameter("userId", dbUser.getId())
                            .executeUpdate();
                }

                // Create new address
                Address address = new Address();
                address.setLine1(line1.trim());
                address.setLine2(line2.trim());
                address.setCity(city);
                address.setPostalCode(postalCode.trim());
                address.setMobile(mobile.trim());
                address.setPrimary(isDefault);
                address.setUser(dbUser);

                hibernateSession.persist(address);
                transaction.commit();

                status = true;
                message = "New address added successfully.";
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            message = "Failed to add new address: " + e.getMessage();
        } finally {
            if (hibernateSession != null) {
                hibernateSession.close();
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }
}
