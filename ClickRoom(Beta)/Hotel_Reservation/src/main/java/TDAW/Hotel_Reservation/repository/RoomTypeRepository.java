package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.room.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType,Long> {
    Page<RoomType> findAll(Pageable pageable);
    RoomType findByName(String name);
}