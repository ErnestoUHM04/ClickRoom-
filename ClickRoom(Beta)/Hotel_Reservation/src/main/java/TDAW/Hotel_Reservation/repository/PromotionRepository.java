package TDAW.Hotel_Reservation.repository;

import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion,Long> {
    Page<Promotion> findAll(Pageable pageable);
    Promotion findByCode(String code);
    boolean existsByCode(String code);
}
