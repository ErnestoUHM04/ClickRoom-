package TDAW.Hotel_Reservation.dto.hotel;

import TDAW.Hotel_Reservation.dto.promotion.PromotionDTO;
import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import TDAW.Hotel_Reservation.dto.room.RoomNoDetail;

import java.sql.Time;
import java.util.List;

public record HotelResponse(
        Long id,
        String name,
        String address,
        String city,
        String country,
        String postalCode,
        String phone,
        String email,
        Integer stars,
        Time checkInTime,
        Time checkOutTime,
        String description,
        List<RoomNoDetail> RoomNoDetail,
        List<PromotionDTO> promotionDTOS
) {}
