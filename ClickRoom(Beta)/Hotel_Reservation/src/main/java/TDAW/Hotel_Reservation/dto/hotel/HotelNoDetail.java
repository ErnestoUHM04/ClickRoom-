package TDAW.Hotel_Reservation.dto.hotel;

import TDAW.Hotel_Reservation.dto.promotion.PromotionDTO;
import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import TDAW.Hotel_Reservation.dto.room.RoomNoDetail;

import java.sql.Time;
import java.util.List;

public record HotelNoDetail(
        Long id,
        String name,
        String city,
        String country,
        String phone,
        String email,
        Integer stars,
        String description,
        List<RoomNoDetail> roomNoDetails,
        List<PromotionDTO> promotionDTOS
) {
}
