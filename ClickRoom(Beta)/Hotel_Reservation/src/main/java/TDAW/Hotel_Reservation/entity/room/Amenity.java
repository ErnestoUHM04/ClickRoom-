package TDAW.Hotel_Reservation.entity.room;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long amenityId;

    @Column(unique = true)
    private String name;

    private String icon;

    @ManyToMany(mappedBy = "amenities")
    private List<RoomType> roomTypes = new ArrayList<>();
}