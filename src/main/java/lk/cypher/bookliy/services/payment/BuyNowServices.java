package lk.cypher.bookliy.services.payment;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import lk.cypher.bookliy.dto.*;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.mail.OrderConfirmationMail;
import lk.cypher.bookliy.provider.MailServiceProvider;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.ENV;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.util.PayHereUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class BuyNowServices {

    /**
     * Load user address data for the Buy Now modal
     */
    public String getBuyNowAddressData(HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        User sessionUser = (User) request.getSession().getAttribute("user");
        if (sessionUser == null) {
            message = "User not logged in.";
        } else {
            try (Session hibernateSession = HibernateUtil.getSessionFactory().openSession()) {
                Address primaryAddress = hibernateSession.createQuery(
                                "FROM Address a WHERE a.user.id =:userId AND a.isPrimary =:primary", Address.class)
                        .setParameter("userId", sessionUser.getId())
                        .setParameter("primary", true)
                        .getSingleResultOrNull();

                if (primaryAddress != null) {
                    AddressDTO addressDTO = buildAddressDTO(primaryAddress);
                    responseObject.add("userPrimaryAddress", AppUtil.gson.toJsonTree(addressDTO));
                }

                List<DeliveryType> deliveryTypes = hibernateSession
                        .createQuery("FROM DeliveryType d", DeliveryType.class).getResultList();
                List<DeliveryTypeDTO> deliveryTypeDTOs = deliveryTypes.stream().map(d -> {
                    DeliveryTypeDTO dto = new DeliveryTypeDTO();
                    dto.setId(d.getId());
                    dto.setName(d.getName());
                    dto.setPrice(d.getPrice());
                    return dto;
                }).toList();

                responseObject.add("deliveryTypeList", AppUtil.gson.toJsonTree(deliveryTypeDTOs));
                status = true;
            }
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    /**
     * Process the Buy Now request: create a single-item order and return PayHere payment details.
     */
    public String processBuyNow(BuyNowDTO requestDTO, HttpServletRequest request) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Transaction transaction = null;

        try {
            transaction = hibernateSession.beginTransaction();

            User sessionUser = (User) request.getSession().getAttribute("user");
            if (sessionUser == null) {
                message = "Session expired. Please login again and try!";
            } else {
                // Validate qty
                if (requestDTO.getQty() <= 0) {
                    message = "Invalid quantity.";
                } else {
                    User dbUser = hibernateSession.find(User.class, sessionUser.getId());

                    // Resolve stock
                    Stock stock = hibernateSession.find(Stock.class, requestDTO.getStockId());
                    if (stock == null) {
                        message = "Product not found.";
                    } else if (stock.getQty() < requestDTO.getQty()) {
                        message = "Insufficient stock. Only " + stock.getQty() + " item(s) available.";
                    } else {
                        // Resolve or create shipping address
                        Address shippingAddress = null;

                        if (requestDTO.isCurrentAddress()) {
                            shippingAddress = hibernateSession.createQuery(
                                            "FROM Address a WHERE a.user=:user AND a.isPrimary=:primary", Address.class)
                                    .setParameter("user", dbUser)
                                    .setParameter("primary", true)
                                    .getSingleResultOrNull();
                            if (shippingAddress == null) {
                                message = "No primary address found. Please add an address.";
                            }
                        } else {
                            // Validate new address fields
                            if (requestDTO.getFirstName() == null || requestDTO.getFirstName().isBlank()) {
                                message = "First Name is required!";
                            } else if (requestDTO.getLastName() == null || requestDTO.getLastName().isBlank()) {
                                message = "Last Name is required!";
                            } else if (requestDTO.getCityId() == AppUtil.DEFAULT_SELECTOR_VALUE) {
                                message = "Please select a city!";
                            } else if (requestDTO.getLineOne() == null || requestDTO.getLineOne().isBlank()) {
                                message = "Address line one is required!";
                            } else if (requestDTO.getPostalCode() == null || requestDTO.getPostalCode().isBlank()) {
                                message = "Postal code is required!";
                            } else if (!requestDTO.getPostalCode().matches(Validator.POSTAL_CODE_VALIDATION)) {
                                message = "Enter a valid postal code!";
                            } else if (requestDTO.getMobile() == null || requestDTO.getMobile().isBlank()) {
                                message = "Mobile number is required!";
                            } else if (!requestDTO.getMobile().matches(Validator.MOBILE_VALIDATION)) {
                                message = "Enter a valid mobile number!";
                            } else {
                                City city = hibernateSession.find(City.class, requestDTO.getCityId());
                                if (city == null) {
                                    message = "City not found. Select the correct city!";
                                } else {
                                    String lineOne = requestDTO.getLineOne().trim();
                                    String lineTwo = requestDTO.getLineTwo() == null ? "" : requestDTO.getLineTwo().trim();
                                    String postalCode = requestDTO.getPostalCode().trim();
                                    String mobile = requestDTO.getMobile().trim();

                                    Address matchingAddress = findMatchingAddress(hibernateSession, dbUser, city, lineOne, lineTwo, postalCode, mobile);
                                    if (matchingAddress == null) {
                                        matchingAddress = new Address();
                                        matchingAddress.setPrimary(true);
                                        matchingAddress.setLine1(lineOne);
                                        matchingAddress.setLine2(lineTwo);
                                        matchingAddress.setPostalCode(postalCode);
                                        matchingAddress.setMobile(mobile);
                                        matchingAddress.setCity(city);
                                        matchingAddress.setUser(dbUser);
                                        hibernateSession.persist(matchingAddress);
                                    }

                                    ensurePrimaryAddress(hibernateSession, dbUser, matchingAddress);
                                    shippingAddress = matchingAddress;
                                }
                            }
                        }

                        if (shippingAddress != null) {
                            // Create the pending order (single item — does NOT touch the cart)
                            Order pendingOrder = createBuyNowOrder(dbUser, stock, requestDTO.getQty(), hibernateSession);
                            PayHereDTO paymentDetails = buildPaymentDetails(hibernateSession, pendingOrder, shippingAddress);
                            responseObject.add("paymentDetails", AppUtil.gson.toJsonTree(paymentDetails));
                            status = true;
                        }
                    }
                }
            }

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
            message = "An error occurred during buy now: " + e.getMessage();
            status = false;
        } finally {
            hibernateSession.close();
        }

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }

    /**
     * Complete a Buy Now order after successful PayHere payment notification.
     * Updates stock, sets status to COMPLETED, sends confirmation email.
     */
    public void completeBuyNowOrder(int orderId) {
        try (Session hibernateSession = HibernateUtil.getSessionFactory().openSession()) {
            Transaction transaction = hibernateSession.beginTransaction();
            try {
                Order order = hibernateSession.find(Order.class, orderId);
                if (order == null) {
                    throw new RuntimeException("Order not found: " + orderId);
                }

                // Deduct stock
                List<OrderItem> orderItems = order.getOrderItems();
                if (orderItems != null) {
                    for (OrderItem item : orderItems) {
                        Stock stock = item.getStock();
                        int remaining = stock.getQty() - item.getQty();
                        if (remaining < 0) {
                            throw new RuntimeException("Insufficient stock for: " + stock.getProduct().getTitle());
                        }
                        stock.setQty(remaining);
                        hibernateSession.merge(stock);
                    }
                }

                // Update status to COMPLETED
                Status completedStatus = hibernateSession
                        .createNamedQuery("Status.findByValue", Status.class)
                        .setParameter("value", String.valueOf(Status.Type.COMPLETED))
                        .getSingleResult();
                order.setStatus(completedStatus);
                hibernateSession.merge(order);

                transaction.commit();

                // Send confirmation email
                try {
                    OrderConfirmationMail mail = new OrderConfirmationMail(order);
                    MailServiceProvider.getInstance().sendMail(mail);
                    System.out.println("Buy Now confirmation email queued for order: " + orderId);
                } catch (Exception emailEx) {
                    System.err.println("Failed to send buy now confirmation email for order " + orderId + ": " + emailEx.getMessage());
                }

            } catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException("Failed to complete buy now order: " + e.getMessage(), e);
            }
        }
    }

    /**
     * Called from client-side after PayHere onCompleted callback.
     * Idempotent: if already completed by notify URL, just returns success.
     */
    public String completeAndVerifyBuyNow(String orderId) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        try {
            int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));

            try (Session hibernateSession = HibernateUtil.getSessionFactory().openSession()) {
                Order order = hibernateSession.find(Order.class, oId);
                if (order == null) {
                    message = "Order not found.";
                } else if (order.getStatus().getValue().equals(String.valueOf(Status.Type.COMPLETED))) {
                    status = true;
                    message = "Order already completed.";
                } else {
                    completeBuyNowOrder(oId);
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

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private Order createBuyNowOrder(User user, Stock stock, int qty, Session session) {
        DeliveryType deliveryType = session
                .createQuery("FROM DeliveryType WHERE id = :id", DeliveryType.class)
                .setParameter("id", 1)
                .getSingleResultOrNull();
        if (deliveryType == null) {
            throw new RuntimeException("Default delivery type not configured.");
        }

        Status pendingStatus = session
                .createQuery("FROM Status WHERE value = :value", Status.class)
                .setParameter("value", "Pending")
                .getSingleResultOrNull();
        if (pendingStatus == null) {
            throw new RuntimeException("Pending status not configured.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(pendingStatus);
        order.setDeliveryType(deliveryType);
        session.persist(order);

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setStock(stock);
        item.setQty(qty);
        item.setRating(0);
        session.persist(item);

        session.flush();
        return order;
    }

    private PayHereDTO buildPaymentDetails(Session session, Order order, Address address) {
        String orderId = "000" + order.getId();
        String returnUrl = ENV.get("app.public.url") + "/api/payments/return";
        String cancelUrl = ENV.get("app.public.url") + "/api/payments/cancel";
        String notifyUrl = ENV.get("app.public.url") + "/api/payments/buy-now-notify";

        List<OrderItem> items = session
                .createQuery("FROM OrderItem oi WHERE oi.order.id =:orderId", OrderItem.class)
                .setParameter("orderId", order.getId())
                .getResultList();

        StringBuilder itemsLabel = new StringBuilder();
        double subtotal = 0;
        for (OrderItem oi : items) {
            if (!itemsLabel.isEmpty()) itemsLabel.append(", ");
            itemsLabel.append(oi.getStock().getProduct().getTitle())
                    .append(" x").append(oi.getQty());
            subtotal += oi.getStock().getPrice() * oi.getQty();
        }
        itemsLabel.append(", Shipping");

        List<DeliveryType> deliveryTypes = session
                .createQuery("FROM DeliveryType d", DeliveryType.class).getResultList();
        double shippingCost = deliveryTypes.isEmpty() ? 0 : deliveryTypes.getFirst().getPrice();
        double total = subtotal + shippingCost;

        StringBuilder userAddress = new StringBuilder(address.getLine1());
        if (address.getLine2() != null && !address.getLine2().isBlank()) {
            userAddress.append(", ").append(address.getLine2());
        }

        User user = order.getUser();
        String hash = PayHereUtil.generateHash(orderId, total);

        PayHereDTO dto = new PayHereDTO();
        dto.setSandbox(true);
        dto.setMerchant_id(PayHereUtil.getMerchantId());
        dto.setReturn_url(returnUrl);
        dto.setCancel_url(cancelUrl);
        dto.setNotify_url(notifyUrl);
        dto.setFirst_name(user.getFirstName());
        dto.setLast_name(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(address.getMobile());
        dto.setAddress(userAddress.toString());
        dto.setCity(address.getCity().getName());
        dto.setCountry(PayHereUtil.APP_COUNTRY);
        dto.setOrder_id(orderId);
        dto.setItems(itemsLabel.toString());
        dto.setCurrency(PayHereUtil.APP_CURRENCY);
        dto.setAmount(String.valueOf(total));
        dto.setHash(hash);
        return dto;
    }

    private AddressDTO buildAddressDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setFirstName(address.getUser().getFirstName());
        dto.setLastName(address.getUser().getLastName());
        dto.setEmail(address.getUser().getEmail());
        dto.setLineOne(address.getLine1());
        dto.setLineTwo(address.getLine2());
        dto.setPostalCode(address.getPostalCode());
        dto.setMobile(address.getMobile());
        dto.setPrimary(address.isPrimary());

        CityDTO cityDTO = new CityDTO();
        cityDTO.setId(address.getCity().getId());
        dto.setCityDTO(cityDTO);

        DistrictDTO districtDTO = new DistrictDTO();
        districtDTO.setId(address.getCity().getDistrict().getId());
        dto.setDistrictDTO(districtDTO);

        return dto;
    }

    private Address findMatchingAddress(Session session, User user, City city, String lineOne, String lineTwo, String postalCode, String mobile) {
        return session.createQuery(
                        "FROM Address a WHERE a.user = :user " +
                                "AND lower(a.line1) = :lineOne " +
                                "AND lower(coalesce(a.line2, '')) = :lineTwo " +
                                "AND a.city = :city " +
                                "AND a.postalCode = :postalCode " +
                                "AND a.mobile = :mobile",
                        Address.class)
                .setParameter("user", user)
                .setParameter("lineOne", lineOne.toLowerCase())
                .setParameter("lineTwo", lineTwo.toLowerCase())
                .setParameter("city", city)
                .setParameter("postalCode", postalCode)
                .setParameter("mobile", mobile)
                .getSingleResultOrNull();
    }

    private void ensurePrimaryAddress(Session session, User user, Address selected) {
        session.createQuery("UPDATE Address SET isPrimary = false WHERE user.id = :userId AND id <> :addressId")
                .setParameter("userId", user.getId())
                .setParameter("addressId", selected.getId())
                .executeUpdate();
        if (!selected.isPrimary()) {
            selected.setPrimary(true);
            session.merge(selected);
        }
    }
}