package lk.cypher.bookliy.dto;

public class BuyNowDTO {
    private int stockId;
    private int qty;
    private boolean isCurrentAddress;
    private String firstName;
    private String lastName;
    private int cityId;
    private String lineOne;
    private String lineTwo;
    private String postalCode;
    private String mobile;

    public BuyNowDTO(){}

    public BuyNowDTO(int stockId, int qty, boolean isCurrentAddress, String firstName, String lastName, int cityId, String lineOne, String lineTwo, String postalCode, String mobile) {
        this.stockId = stockId;
        this.qty = qty;
        this.isCurrentAddress = isCurrentAddress;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cityId = cityId;
        this.lineOne = lineOne;
        this.lineTwo = lineTwo;
        this.postalCode = postalCode;
        this.mobile = mobile;
    }

    public int getStockId() {
        return stockId;
    }

    public void setStockId(int stockId) {
        this.stockId = stockId;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public boolean isCurrentAddress() {
        return isCurrentAddress;
    }

    public void setCurrentAddress(boolean currentAddress) {
        isCurrentAddress = currentAddress;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getCityId() {
        return cityId;
    }

    public void setCityId(int cityId) {
        this.cityId = cityId;
    }

    public String getLineOne() {
        return lineOne;
    }

    public void setLineOne(String lineOne) {
        this.lineOne = lineOne;
    }

    public String getLineTwo() {
        return lineTwo;
    }

    public void setLineTwo(String lineTwo) {
        this.lineTwo = lineTwo;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}
