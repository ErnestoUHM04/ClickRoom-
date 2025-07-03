package TDAW.Hotel_Reservation.entity.hotel;

import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import TDAW.Hotel_Reservation.entity.room.Room;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hotelId;

    @Column(unique = true)
    private String name;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    private String phone;
    @Column(unique = true)
    private String email;
    private Integer stars;
    private Time checkInTime;
    private Time checkOutTime;
    private String description;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Promotion> promotions = new ArrayList<>();

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();
}
