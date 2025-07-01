package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.reservation.ReservationRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRoomRepository extends JpaRepository<ReservationRoom,Long> {
}
