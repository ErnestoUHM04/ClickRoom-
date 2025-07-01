package TDAW.Hotel_Reservation.service.interfaces;

import TDAW.Hotel_Reservation.dto.hotel.HotelDTO;
import TDAW.Hotel_Reservation.dto.hotel.HotelNoDetail;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IHotelService {
    Hotel create(HotelDTO hotelDTO);
    Hotel findById(Long id);
    Hotel findByName(String name);
    Page<HotelNoDetail> findAll(Pageable pageable);
    Hotel update(HotelDTO hotelDTO);
    void delete(Long id);
}
