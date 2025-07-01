package TDAW.Hotel_Reservation.entity.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true)
    private String email;
    private String firstName;
    private String passwordHash;
    private String lastName;
    private String phone;
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    @Enumerated(EnumType.STRING)
    @Column(insertable=false, updatable=false)
    private UserRole role;

    private Boolean blocked;
}