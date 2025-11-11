package lk.cypher.bookily.entity;

import jakarta.persistence.*;

@Entity
@NamedQuery(name = "Status.findByValue", query = "FROM Status s WHERE s.value=:value")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 45, nullable = false)
    private String value;

    public enum Type {
        ACTIVE,
        PENDING,
        INACTIVE,
        BLOCKED,
        DELIVERED,
        PACKING,
        APPROVED,
        REJECTED,
        CANCELLED,
        VERIFIED,
        RECEIVED,
        COMPLETED
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
