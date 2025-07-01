package TDAW.Hotel_Reservation.service.interfaces;

import TDAW.Hotel_Reservation.dto.room.RoomTypeDTO;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IRoomTypeService {
    RoomType create(RoomTypeDTO roomTypeDTO);
    RoomType findById(Long id);
    RoomType findByName(String name);
    Page<RoomTypeDTO> findAll(Pageable pageable);
    RoomType update(RoomTypeDTO roomTypeDTO);
    void delete(Long id);
}
