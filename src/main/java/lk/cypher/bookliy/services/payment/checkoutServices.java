package lk.cypher.bookliy.services.payment;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import lk.cypher.bookliy.dto.*;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.services.CommonServices;
import lk.cypher.bookliy.services.OrderServices;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.ENV;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.util.PayHereUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.ArrayList;
import java.util.List;

public class checkoutServices {
    private final OrderServices orderServices = new OrderServices();

    // Load user checkout data
    public String getCheckoutData(HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        String message = "";
        boolean status = false;

        User sessionUser = (User) request.getSession().getAttribute("user");
        if (sessionUser == null) {
            message = "User not logged in.";
        } else {
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Address primaryAddress = hibernateSession.createQuery("FROM Address a WHERE a.user.id =:userId AND a.isPrimary =:primary", Address.class)
                    .setParameter("userId", sessionUser.getId())
                    .setParameter("primary", true)
                    .getSingleResultOrNull();

            if (primaryAddress == null) {
                message = "No primary address found.";
            } else {
                AddressDTO addressDTO = getAddressDTO(primaryAddress);
                List<Cart> cartList = hibernateSession.createQuery("FROM Cart c WHERE c.user.id=:id", Cart.class)
                        .setParameter("id", sessionUser.getId())
                        .getResultList();

                List<CartDTO> cartDTOList = new CommonServices().generateCartDTOs(cartList);

                List<DeliveryTypeDTO> deleiverTypeDTOList = new ArrayList<>();
                List<DeliveryType> deliveryTypeList = hibernateSession.createQuery("FROM DeliveryType d", DeliveryType.class).getResultList();
                for (DeliveryType deliveryType : deliveryTypeList) {
                    DeliveryTypeDTO deliveryTypeDTO = new DeliveryTypeDTO();
                    deliveryTypeDTO.setId(deliveryType.getId());
                    deliveryTypeDTO.setName(deliveryType.getName());
                    deliveryTypeDTO.setPrice(deliveryType.getPrice());
                    deleiverTypeDTOList.add(deliveryTypeDTO);
                }
                status = true;
                responseObject.add("userPrimaryAddress", AppUtil.gson.toJsonTree(addressDTO));
                responseObject.add("cartList", AppUtil.gson.toJsonTree(cartDTOList));
                responseObject.add("deliveryTypeList", AppUtil.gson.toJsonTree(deleiverTypeDTOList));
            }
            hibernateSession.close();
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Process checkout request
    public String processCheckout(CheckoutRequestDTO requestDTO, HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;

        try {
            transaction = hibernateSession.beginTransaction(); // START TRANSACTION HERE

            User sessionUser = (User) request.getSession().getAttribute("user");
            if (sessionUser == null) {
                message = "Session expired. Please login again and try!";
            } else {
                User dbUser = hibernateSession.find(User.class, sessionUser.getId());
                if (requestDTO.isCurrentAddress()) {
                    Address address = hibernateSession.createQuery("FROM Address a WHERE a.user=:user AND a.isPrimary=:primary", Address.class)
                            .setParameter("user", dbUser)
                            .setParameter("primary", requestDTO.isCurrentAddress())
                            .getSingleResultOrNull();
                    if (address == null) {
                        message = "Address not found. Please check again!";
                    } else {
                        Order pendingOrder = orderServices.createPendingOrder(dbUser, hibernateSession);
                        PayHereDTO paymentDetails = createPaymentDetails(hibernateSession, pendingOrder);
                        responseObject.add("paymentDetails", AppUtil.gson.toJsonTree(paymentDetails));
                        status = true;
                    }
                } else {
                    if (requestDTO.getFirstName().isBlank()) {
                        message = "First Name is required!";
                    } else if (requestDTO.getLastName().isBlank()) {
                        message = "Last Name is required!";
                    } else if (requestDTO.getCityId() == AppUtil.DEFAULT_SELECTOR_VALUE) {
                        message = "Please select a city!";
                    } else if (requestDTO.getLineOne().isBlank()) {
                        message = "Address line one is required!";
                    } else if (requestDTO.getPostalCode().isBlank()) {
                        message = "Postal code is required!";
                    } else if (!requestDTO.getPostalCode().matches(Validator.POSTAL_CODE_VALIDATION)) {
                        message = "Enter a valid postal code!";
                    } else if (requestDTO.getMobile().isBlank()) {
                        message = "Mobile number is required!";
                    } else if (!requestDTO.getMobile().matches(Validator.MOBILE_VALIDATION)) {
                        message = "Enter a valid mobile number!";
                    } else {
                        City city = hibernateSession.find(City.class, requestDTO.getCityId());
                        if (city == null) {
                            message = "City not found. Select correct city!";
                        } else {
                            Address existingPrimary = hibernateSession.createQuery("FROM Address a WHERE a.user=:user AND a.isPrimary=:primary", Address.class)
                                    .setParameter("user", dbUser)
                                    .setParameter("primary", true)
                                    .getSingleResultOrNull();
                            if (existingPrimary != null) {
                                existingPrimary.setPrimary(false);
                                hibernateSession.merge(existingPrimary);
                            }
                            Address address = new Address();
                            address.setPrimary(true);
                            address.setLine1(requestDTO.getLineOne());
                            address.setLine2(requestDTO.getLineTwo());
                            address.setPostalCode(requestDTO.getPostalCode());
                            address.setMobile(requestDTO.getMobile());
                            address.setCity(city);
                            address.setUser(dbUser);
                            hibernateSession.persist(address);

                            Order pendingOrder = orderServices.createPendingOrder(dbUser, hibernateSession);
                            PayHereDTO paymentDetails = createPaymentDetails(hibernateSession, pendingOrder);
                            responseObject.add("paymentDetails", AppUtil.gson.toJsonTree(paymentDetails));
                            status = true;
                        }
                    }
                }
            }

            // Commit only if successful
            if (status && transaction != null) {
                transaction.commit();
            } else if (transaction != null) {
                transaction.rollback();
            }

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            message = "An error occurred during checkout: " + e.getMessage();
            status = false;
        } finally {
            hibernateSession.close();
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    // Create payment details for PayHere
    private PayHereDTO createPaymentDetails(Session hibernateSession, Order o) {
        String order_id = "000" + o.getId();
        String returnUrl = ENV.get("app.public.url") + "/api/payments/return";
        String cancelUrl = ENV.get("app.public.url") + "/api/payments/cancel";
        String notifyUrl = ENV.get("app.public.url") + "/api/payments/notify";

        Order order = hibernateSession.find(Order.class, o.getId());
        User user = o.getUser();
        Address address = hibernateSession.createQuery("FROM Address a WHERE a.user =:user AND a.isPrimary =:primary", Address.class)
                .setParameter("user", user)
                .setParameter("primary", true)
                .getSingleResultOrNull();

        StringBuilder userAddress = new StringBuilder(address.getLine1());
        if (!address.getLine2().isBlank()) {
            userAddress.append(", ").append(address.getLine2());
        }

        StringBuilder items = new StringBuilder();
        double subtotal = 0;

        List<OrderItem> orderItems = hibernateSession.createQuery("FROM OrderItem oi WHERE oi.order.id =:orderId", OrderItem.class)
                .setParameter("orderId", order.getId())
                .getResultList();

        for (OrderItem orderItem : orderItems) {
            if (!items.isEmpty()) {
                items.append(", ");
            }

            items.append(orderItem.getStock().getProduct().getTitle())
                    .append(" x")
                    .append(orderItem.getQty());
            subtotal += orderItem.getStock().getPrice() * orderItem.getQty();
        }
        List<DeliveryType> deliveryTypeList = hibernateSession.createQuery("FROM DeliveryType d", DeliveryType.class).getResultList();
        double shippingCost = deliveryTypeList.isEmpty() ? 0 : deliveryTypeList.getFirst().getPrice();

        // Add shipping to items description
        items.append(", Shipping");

        // Calculate grand total
        double amount = subtotal + shippingCost;

        String hasValue = PayHereUtil.generateHash(order_id, amount);
        PayHereDTO payHereDTO = new PayHereDTO();
        payHereDTO.setSandbox(true);
        payHereDTO.setMerchant_id(PayHereUtil.getMerchantId());
        payHereDTO.setReturn_url(returnUrl);
        payHereDTO.setCancel_url(cancelUrl);
        payHereDTO.setNotify_url(notifyUrl);
        payHereDTO.setFirst_name(user.getFirstName());
        payHereDTO.setLast_name(user.getLastName());
        payHereDTO.setEmail(user.getEmail());
        payHereDTO.setPhone(address.getMobile());
        payHereDTO.setAddress(userAddress.toString());
        payHereDTO.setCity(address.getCity().getName());
        payHereDTO.setCountry(PayHereUtil.APP_COUNTRY);
        payHereDTO.setOrder_id(order_id);
        payHereDTO.setItems(items.toString());
        payHereDTO.setCurrency(PayHereUtil.APP_CURRENCY);
        payHereDTO.setAmount(String.valueOf(amount));
        payHereDTO.setHash(hasValue);
        return payHereDTO;
    }

    // Generate AddressDTO from Address entity
    private static AddressDTO getAddressDTO(Address primaryAddress) {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setId(primaryAddress.getId());
        addressDTO.setEmail(primaryAddress.getUser().getEmail());
        addressDTO.setFirstName(primaryAddress.getUser().getFirstName());
        addressDTO.setLastName(primaryAddress.getUser().getLastName());
        addressDTO.setLineOne(primaryAddress.getLine1());
        addressDTO.setLineTwo(primaryAddress.getLine2());
        addressDTO.setPostalCode(primaryAddress.getPostalCode());
        addressDTO.setMobile(primaryAddress.getMobile());
        addressDTO.setPrimary(primaryAddress.isPrimary());

        User user = primaryAddress.getUser();
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());

        CityDTO cityDTO = new CityDTO();
        cityDTO.setId(primaryAddress.getCity().getId());

        DistrictDTO districtDTO = new DistrictDTO();
        districtDTO.setId(primaryAddress.getCity().getDistrict().getId());

        addressDTO.setDistrictDTO(districtDTO);
        addressDTO.setCityDTO(cityDTO);
        return addressDTO;
    }
}
