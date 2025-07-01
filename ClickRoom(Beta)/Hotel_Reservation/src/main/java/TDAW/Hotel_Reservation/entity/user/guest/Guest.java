package TDAW.Hotel_Reservation.entity.user.guest;

import TDAW.Hotel_Reservation.entity.reservation.Reservation;
import TDAW.Hotel_Reservation.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("GUEST")
public class Guest extends User {
    @Column(unique = true)
    private String passportNumber;
    private String nationality;
    private LocalDate birthdate;

    @OneToMany(mappedBy = "guest", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();
}