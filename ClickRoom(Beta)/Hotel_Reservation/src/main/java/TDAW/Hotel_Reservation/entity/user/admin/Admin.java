package TDAW.Hotel_Reservation.entity.user.admin;

import TDAW.Hotel_Reservation.entity.user.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("SUPER")
public class Admin extends User {
}