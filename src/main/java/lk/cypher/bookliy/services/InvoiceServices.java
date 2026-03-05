package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import lk.cypher.bookliy.dto.InvoiceDTO;
import lk.cypher.bookliy.dto.InvoiceItemDTO;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class InvoiceServices {
    private static final String INVOICE_PAID_STATUS = "PAID";

    // Load invoice data for a given order ID
    public String getInvoiceData(String orderId) {
        JsonObject responseObject = new JsonObject();
        boolean status = false;
        String message = "";

        int oId = Integer.parseInt(orderId.replaceAll(Validator.NON_DIGIT_PATTERN, ""));
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Order order = hibernateSession.find(Order.class, oId);
        if (order == null) {
            message = "Incorrect order details. Please check credentials!";
        } else {
            if (order.getStatus().getValue().equals(String.valueOf(Status.Type.COMPLETED))) {
                InvoiceDTO invoiceDTO = new InvoiceDTO();
                invoiceDTO.setInvoiceNo("000" + order.getId());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
                invoiceDTO.setInvoiceDate(formatter.format(order.getCreatedAt()));

                User user = order.getUser();
                invoiceDTO.setBuyerName(user.getFirstName() + " " + user.getLastName());
                Address address = hibernateSession.createQuery("FROM Address a WHERE a.user=:user AND a.isPrimary=true", Address.class)
                        .setParameter("user", user)
                        .getSingleResult();
                invoiceDTO.setAddress(address.getLine1() +
                        (address.getLine2() != null && !address.getLine2().isBlank() ? ", " + address.getLine2() : ""));
                invoiceDTO.setCityName(address.getCity().getName());
                invoiceDTO.setCountryName("Sri Lanka");
                invoiceDTO.setEmail(user.getEmail());

                List<InvoiceItemDTO> itemDTOS = new ArrayList<>();
                double shippingCharges = 0;

                // Calculate shipping cost (flat rate for the entire order)
                try {
                    DeliveryType shippingCostType = hibernateSession
                            .createNamedQuery("DeliveryType.findByName", DeliveryType.class)
                            .setParameter("name", "Shipping Cost")
                            .getSingleResult();

                    if (shippingCostType != null && shippingCostType.getPrice() != null) {
                        shippingCharges = shippingCostType.getPrice();
                    }
                } catch (Exception e) {
                    // Log error or use default shipping cost
                    throw new RuntimeException("Failed to retrieve shipping cost: " + e.getMessage());
                }

                for (OrderItem orderItem : order.getOrderItems()) {
                    InvoiceItemDTO itemDTO = new InvoiceItemDTO();
                    itemDTO.setItemName(orderItem.getStock().getProduct().getTitle());
                    itemDTO.setItemQty(orderItem.getQty());
                    itemDTO.setItemPrice(orderItem.getStock().getPrice());
                    itemDTO.setCategoryName(orderItem.getStock().getProduct().getCategory().getName());
                    itemDTO.setImages(orderItem.getStock().getProduct().getImages());
                    itemDTO.setAuthors(orderItem.getStock().getProduct().getAuthor());

                    itemDTOS.add(itemDTO);
                }
                invoiceDTO.setShippingCharges(shippingCharges);
                invoiceDTO.setInvoiceItemDTOList(itemDTOS);
                invoiceDTO.setInvoiceStatus(InvoiceServices.INVOICE_PAID_STATUS);

                status = true;
                responseObject.add("invoiceData", AppUtil.gson.toJsonTree(invoiceDTO));
            }
        }
        hibernateSession.close();

        responseObject.addProperty("status", status);
        responseObject.addProperty("message", message);
        return AppUtil.gson.toJson(responseObject);
    }
}
