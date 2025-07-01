package TDAW.Hotel_Reservation.dto.hotel;

import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.sql.Time;
import java.util.List;

public record HotelDTO(
        Long id,
        @NotBlank
        String name,
        @NotBlank
        String address,
        @NotBlank
        String city,
        @NotBlank
        String country,
        @NotBlank
        String postalCode,
        @NotBlank
        String phone,
        @Email
        @NotBlank
        String email,
        Integer stars,
        @NotNull
        Time checkInTime,
        @NotNull
        Time checkOutTime,
        @NotBlank
        String description,
        @NotEmpty
        List<RoomDTO> roomDTOS
){}
