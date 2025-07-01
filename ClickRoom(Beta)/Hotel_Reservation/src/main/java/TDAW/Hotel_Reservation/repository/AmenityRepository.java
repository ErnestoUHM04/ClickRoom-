package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.room.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity,Long> {
    Page<Amenity> findAll(Pageable pageable);
    Amenity findByName(String name);
}
