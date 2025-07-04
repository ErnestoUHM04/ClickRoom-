package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.reservation.Reservation;
import TDAW.Hotel_Reservation.entity.reservation.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    @Query("SELECT r FROM Reservation r WHERE r.guest.userId = :userId")
    List<Reservation> findByGuest(@Param("userId") Long userId);

    List<Reservation> findAllByStatus(ReservationStatus reservationStatus);

    List<Reservation> findByCheckInLessThanEqualAndCheckOutGreaterThanEqual(LocalDate checkIn, LocalDate checkOut);

}
