package lk.cypher.bookliy.util;

import jakarta.ws.rs.core.MultivaluedMap;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Locale;

public class PayHereUtil {
    private static final String MERCHANT_ID = ENV.get("payHere.merchant.id");
    private static final String MERCHANT_SECRET = ENV.get("payHere.merchant.secret");
    public static final String APP_CURRENCY = "LKR"; //PayHere Payment Gateway Currency
    public static final String APP_COUNTRY = "Sri Lanka"; //PayHere Payment Gateway Country
    public static final int PAYMENT_SUCCESS = 2; // Payment Success Status Code

    // Get Merchant ID
    public static String getMerchantId() {
        return MERCHANT_ID;
    }

    // Generate Hash for Payment
    public static String generateHash(String orderId, double amount) {
        String formattedAmount = String.format(Locale.US, "%.2f", amount);
        String secretHash = md5(PayHereUtil.MERCHANT_SECRET).toUpperCase();
        String raw = PayHereUtil.MERCHANT_ID +
                orderId +
                formattedAmount +
                PayHereUtil.APP_CURRENCY +
                secretHash;
        return md5(raw).toUpperCase();
    }

    // Validate Payment Notification
    public static boolean validateNotify(MultivaluedMap<String, String> form) {
        String merchantId = form.getFirst("merchant_id");
        String orderId = form.getFirst("order_id");
        String payHereAmount = form.getFirst("payment_amount");
        String payHereCurrency = form.getFirst("payment_currency");
        String statusCode = form.getFirst("status_code");
        String md5sig = form.getFirst("md5sig");
        String localSignature = md5(
                merchantId +
                        orderId +
                        payHereAmount +
                        payHereCurrency +
                        statusCode +
                        md5(PayHereUtil.MERCHANT_SECRET).toUpperCase()
        ).toUpperCase();
        return localSignature.equals(md5sig);
    }

    private static String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("md5");
            byte[] messageDigest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : messageDigest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 Error: " + e.getMessage());
        }
    }
}
