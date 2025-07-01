package TDAW.Hotel_Reservation.service.interfaces;

import TDAW.Hotel_Reservation.dto.room.AmenityDTO;
import TDAW.Hotel_Reservation.entity.room.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface IAmenityService {
    Amenity create(AmenityDTO amenityDTO);
    Amenity findById(Long id);
    Amenity findByName(String name);
    Page<AmenityDTO> findAll(Pageable pageable);
    Amenity update(AmenityDTO amenityDTO);
    void delete(Long id);
}
