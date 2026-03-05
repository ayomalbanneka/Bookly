package lk.cypher.bookliy.mail;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import lk.cypher.bookliy.entity.Order;
import lk.cypher.bookliy.entity.OrderItem;

import java.time.format.DateTimeFormatter;

public class OrderConfirmationMail extends Mailable {
    private final String to;
    private final String customerName;
    private final int orderId;
    private final String orderDate;
    private final double totalAmount;
    private final double deliveryCost;
    private final java.util.List<OrderItemInfo> items;

    public static class OrderItemInfo {
        private final String title;
        private final String author;
        private final int qty;
        private final double price;

        public OrderItemInfo(String title, String author, int qty, double price) {
            this.title = title;
            this.author = author;
            this.qty = qty;
            this.price = price;
        }

        public String getTitle() { return title; }
        public String getAuthor() { return author; }
        public int getQty() { return qty; }
        public double getPrice() { return price; }
    }

    public OrderConfirmationMail(Order order) {
        this.to = order.getUser().getEmail();
        this.customerName = order.getUser().getFirstName() + " " + order.getUser().getLastName();
        this.orderId = order.getId();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        this.orderDate = formatter.format(order.getCreatedAt());

        double itemsTotal = 0.0;
        this.items = new java.util.ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getStock() != null) {
                    double itemPrice = item.getStock().getPrice();
                    int quantity = item.getQty();
                    itemsTotal += itemPrice * quantity;
                    items.add(new OrderItemInfo(
                            item.getStock().getProduct().getTitle(),
                            item.getStock().getProduct().getAuthor(),
                            quantity,
                            itemPrice
                    ));
                }
            }
        }

        this.deliveryCost = order.getDeliveryType() != null && order.getDeliveryType().getPrice() != null
                ? order.getDeliveryType().getPrice() : 0.0;
        this.totalAmount = itemsTotal + this.deliveryCost;
    }

    @Override
    public String getTo() {
        return to;
    }

    @Override
    public String getSubject() {
        return "Order Confirmation - Bookly #" + orderId;
    }

    @Override
    public void build(Message message) throws MessagingException {
        try {
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(to, false));
            message.setSubject(getSubject());
            message.setContent(getBody(), "text/html; charset=utf-8");
        } catch (Exception e) {
            throw new MessagingException("Failed to build order confirmation email", e);
        }
    }

    private String getBody() {
        StringBuilder itemRows = new StringBuilder();
        double subtotal = 0.0;
        int itemIndex = 0;

        for (OrderItemInfo item : items) {
            double lineTotal = item.getPrice() * item.getQty();
            subtotal += lineTotal;
            String bgColor = itemIndex % 2 == 0 ? "#f8fafc" : "#ffffff";
            itemRows.append(
                    "<tr style='background:" + bgColor + ";'>" +
                    "<td style='padding:16px 20px;border-bottom:1px solid #e2e8f0;'>" +
                        "<div style='font-weight:600;color:#1a202c;font-size:15px;'>" + item.getTitle() + "</div>" +
                        "<div style='color:#718096;font-size:13px;margin-top:4px;'>by " + item.getAuthor() + "</div>" +
                    "</td>" +
                    "<td style='padding:16px 20px;border-bottom:1px solid #e2e8f0;text-align:center;color:#4a5568;font-size:15px;'>" + item.getQty() + "</td>" +
                    "<td style='padding:16px 20px;border-bottom:1px solid #e2e8f0;text-align:right;color:#4a5568;font-size:15px;'>LKR " + String.format("%,.2f", item.getPrice()) + "</td>" +
                    "<td style='padding:16px 20px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#1a202c;font-size:15px;'>LKR " + String.format("%,.2f", lineTotal) + "</td>" +
                    "</tr>"
            );
            itemIndex++;
        }

        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "* { margin: 0; padding: 0; box-sizing: border-box; }" +
                "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #f0f4f8; padding: 40px 20px; }" +
                ".email-wrapper { max-width: 650px; margin: 0 auto; }" +
                ".email-container { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }" +
                ".header { background: #10b981; padding: 50px 40px; text-align: center; }" +
                ".header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin-bottom: 12px; }" +
                ".header p { color: rgba(255,255,255,0.95); font-size: 18px; }" +
                ".content { padding: 50px 40px; }" +
                ".order-badge { display: inline-block; background: #10b981; color: white; padding: 8px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 1px; margin-bottom: 25px; }" +
                ".greeting { text-align: center; margin-bottom: 40px; }" +
                ".greeting h2 { color: #1a202c; font-size: 26px; font-weight: 700; margin-bottom: 12px; }" +
                ".greeting p { color: #4a5568; font-size: 16px; line-height: 1.6; }" +
                ".order-info { background: #f7fafc; border-radius: 16px; padding: 25px; margin-bottom: 30px; }" +
                ".summary-row { padding: 12px 20px; }" +
                ".summary-total { background: #1a202c; border-radius: 12px; padding: 16px 20px; margin-top: 8px; }" +
                ".footer { background: #f8f9fa; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0; }" +
                ".footer p { color: #718096; font-size: 14px; margin: 8px 0; line-height: 1.6; }" +
                ".footer .brand { color: #2d3748; font-weight: 600; font-size: 16px; }" +
                "@media (max-width: 600px) { " +
                "body { padding: 20px 10px; }" +
                ".email-container { border-radius: 16px; }" +
                ".header { padding: 35px 20px; }" +
                ".header h1 { font-size: 26px; }" +
                ".content { padding: 30px 20px; }" +
                "}" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='email-wrapper'>" +
                "<div class='email-container'>" +

                // Header
                "<div class='header'>" +
                "<div style='font-size:48px;margin-bottom:16px;'>✅</div>" +
                "<h1>Order Confirmed!</h1>" +
                "<p>Thank you for your purchase</p>" +
                "</div>" +

                // Content
                "<div class='content'>" +
                "<div class='greeting'>" +
                "<div class='order-badge'>ORDER #" + orderId + "</div>" +
                "<h2>Hi " + customerName + "! 🎉</h2>" +
                "<p>Your order has been confirmed and payment was successful. Here are your order details:</p>" +
                "</div>" +

                // Order Info
                "<div class='order-info'>" +
                "<table style='width:100%;border-collapse:collapse;'>" +
                "<tr><td style='padding:8px 0;color:#718096;font-size:14px;'>Order Number</td><td style='padding:8px 0;text-align:right;color:#1a202c;font-weight:600;font-size:14px;'>#" + orderId + "</td></tr>" +
                "<tr><td style='padding:8px 0;color:#718096;font-size:14px;'>Order Date</td><td style='padding:8px 0;text-align:right;color:#1a202c;font-weight:600;font-size:14px;'>" + orderDate + "</td></tr>" +
                "<tr><td style='padding:8px 0;color:#718096;font-size:14px;'>Payment Status</td><td style='padding:8px 0;text-align:right;'><span style='background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:50px;font-size:13px;font-weight:600;'>Paid</span></td></tr>" +
                "</table>" +
                "</div>" +

                // Order Items Table
                "<div style='margin-bottom:30px;'>" +
                "<h3 style='color:#1a202c;font-size:18px;font-weight:700;margin-bottom:16px;'>📦 Order Items</h3>" +
                "<table style='width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;'>" +
                "<thead>" +
                "<tr style='background:#1a202c;'>" +
                "<th style='padding:14px 20px;text-align:left;color:white;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Product</th>" +
                "<th style='padding:14px 20px;text-align:center;color:white;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Qty</th>" +
                "<th style='padding:14px 20px;text-align:right;color:white;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Price</th>" +
                "<th style='padding:14px 20px;text-align:right;color:white;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Total</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                itemRows +
                "</tbody>" +
                "</table>" +
                "</div>" +

                // Order Summary
                "<div style='background:#f7fafc;border-radius:16px;overflow:hidden;'>" +
                "<div class='summary-row' style='display:flex;justify-content:space-between;align-items:center;'>" +
                "<span style='color:#718096;font-size:15px;'>Subtotal </span>" +
                "<span style='color:#1a202c;font-weight:600;font-size:15px;'>LKR " + String.format("%,.2f", subtotal) + "</span>" +
                "</div>" +
                "<div class='summary-row' style='display:flex;justify-content:space-between;align-items:center;'>" +
                "<span style='color:#718096;font-size:15px;'>Delivery </span>" +
                "<span style='color:#1a202c;font-weight:600;font-size:15px;'>LKR " + String.format("%,.2f", deliveryCost) + "</span>" +
                "</div>" +
                "<div class='summary-total' style='display:flex;justify-content:space-between;align-items:center;'>" +
                "<span style='color:white;font-size:16px;font-weight:600;'>Total Amount </span>" +
                "<span style='color:white;font-size:20px;font-weight:800;'>LKR " + String.format("%,.2f", totalAmount) + "</span>" +
                "</div>" +
                "</div>" +

                // Help Section
                "<div style='text-align:center;margin-top:35px;padding:25px;background:#f0f4f8;border-radius:16px;'>" +
                "<p style='color:#4a5568;font-size:15px;margin-bottom:8px;'>Questions about your order?</p>" +
                "<p style='color:#4a5568;font-size:15px;'>Contact us at <a href='#' style='color:#10b981;text-decoration:none;font-weight:600;'>support@bookly.com</a></p>" +
                "</div>" +
                "</div>" +

                // Footer
                "<div class='footer'>" +
                "<p class='brand'>📚 Bookly</p>" +
                "<p>Happy reading!</p>" +
                "<p style='margin-top:20px;font-size:12px;color:#a0aec0;'>" +
                "This is an automated message, please do not reply.<br>" +
                "© 2026 Bookly. All rights reserved." +
                "</p>" +
                "</div>" +

                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}

