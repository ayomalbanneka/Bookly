package lk.cypher.bookily.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "coupen_code", length = 45, nullable = false, unique = true)
    private String coupenCode;

    @Column(nullable = false)
    private Double value;

    @Column(name = "start_at", nullable = false)
    private Date startAt;

    @Column(name = "expire_at", nullable = false)
    private Date expireAt;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCoupenCode() {
        return coupenCode;
    }

    public void setCoupenCode(String coupenCode) {
        this.coupenCode = coupenCode;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Date getStartAt() {
        return startAt;
    }

    public void setStartAt(Date startAt) {
        this.startAt = startAt;
    }

    public Date getExpireAt() {
        return expireAt;
    }

    public void setExpireAt(Date expireAt) {
        this.expireAt = expireAt;
    }
}
