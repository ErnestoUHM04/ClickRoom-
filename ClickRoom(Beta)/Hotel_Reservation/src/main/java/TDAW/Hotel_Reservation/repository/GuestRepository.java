package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.user.guest.Guest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends JpaRepository<Guest,Long> {
    Page<Guest> findAll(Pageable pageable);
}