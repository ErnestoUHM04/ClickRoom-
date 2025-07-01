package TDAW.Hotel_Reservation.service.interfaces;

import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import TDAW.Hotel_Reservation.dto.room.RoomResponse;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.entity.room.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface IRoomService {
    Room create(RoomDTO roomDTO);
    Room findById(Long id);
    Page<RoomResponse> findAll(Pageable pageable);
    Room update(RoomDTO roomDTO);
    Boolean book(Long id, LocalDate localDate);
    Boolean unbook(Long id, LocalDate localDate);
    void delete(Long id);
}