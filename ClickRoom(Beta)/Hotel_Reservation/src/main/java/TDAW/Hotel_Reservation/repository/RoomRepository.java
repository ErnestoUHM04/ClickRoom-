package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.room.Room;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room,Long> {
    Page<Room> findAll(Pageable pageable);
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.roomType.id = :roomTypeId")
    List<Room> findAllRoomsByHotelAndType(@Param("hotelId") Long hotelId,
                                          @Param("roomTypeId") Long roomTypeId);

    List<Room> findByRoomType(RoomType roomType);

}