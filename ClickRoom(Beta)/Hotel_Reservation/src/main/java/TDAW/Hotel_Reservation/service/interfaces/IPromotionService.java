package TDAW.Hotel_Reservation.service.interfaces;

import TDAW.Hotel_Reservation.dto.promotion.PromotionDTO;
import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IPromotionService {
    Promotion create(PromotionDTO promotionDTO);
    Promotion findById(Long id);
    Promotion findByCode(String code);
    Page<PromotionDTO> findAll(Pageable pageable);
    Promotion update(PromotionDTO promotionDTO);
    void delete(Long id);
}