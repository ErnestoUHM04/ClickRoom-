package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Page<Hotel> findAll(Pageable pageable);
    Hotel findByName(String name);
    Hotel findByCity(String city);
}