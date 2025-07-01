package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.promotion.PromotionDTO;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import TDAW.Hotel_Reservation.repository.HotelRepository;
import TDAW.Hotel_Reservation.repository.PromotionRepository;
import TDAW.Hotel_Reservation.service.Validation;
import TDAW.Hotel_Reservation.service.interfaces.IPromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PromotionService implements IPromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private Validation validation;

    @Override
    public Promotion create(PromotionDTO promotionDTO) {

        Hotel hotel = hotelRepository.findById(promotionDTO.hotelID())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Promotion promotion =
                new Promotion(
                        null,
                        promotionDTO.code(),
                        promotionDTO.discountPercent(),
                        promotionDTO.startDate(),
                        promotionDTO.endDate(),
                        promotionDTO.maxUses(),
                        hotel
                );

        return promotionRepository.save(promotion);
    }

    @Override
    public Promotion findById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
    }

    @Override
    public Promotion findByCode(String code) {
        Promotion promotion = promotionRepository.findByCode(code);
        if(promotion == null) throw new RuntimeException("Promotion not found");
        return promotion;
    }

    @Override
    public Page<PromotionDTO> findAll(Pageable pageable) {
        Page<Promotion> promotions = promotionRepository.findAll(pageable);
        return promotions.map(this::map);
    }

    @Override
    public Promotion update(PromotionDTO promotionDTO) {
        Promotion promotion;
        if(promotionDTO.id() != null){
            promotion = this.findById(promotionDTO.id());

            if(promotionDTO.code() != null){
                validation.validate(promotionDTO,"code");
                promotion.setCode(promotionDTO.code());
            }
        }else{
            promotion = this.findByCode(promotionDTO.code());
        }

        if(promotionDTO.discountPercent() != null)
            promotion.setDiscountPercent(promotionDTO.discountPercent());

        if(promotionDTO.startDate() != null)
            promotion.setStartDate(promotionDTO.startDate());

        if(promotionDTO.endDate() != null)
            promotion.setEndDate(promotionDTO.endDate());

        if(promotionDTO.maxUses() != null)
            promotion.setMaxUses(promotionDTO.maxUses());

        return promotionRepository.save(promotion);
    }

    public boolean use(String code){
        Promotion promotion = this.findByCode(code);

        promotion.setMaxUses(promotion.getMaxUses() - 1);
        if(promotion.getMaxUses() <= 0){
            Hotel hotel = promotion.getHotel();
            if (hotel != null) {
                hotel.getPromotions().remove(promotion);
            }
            promotionRepository.delete(promotion);
            return false;
        }

        promotionRepository.save(promotion);
        return true;
    }

    @Override
    public void delete(Long id) {
        Promotion promotion = this.findById(id);

        Hotel hotel = promotion.getHotel();
        if (hotel != null) {
            hotel.getPromotions().remove(promotion);
        }

        promotionRepository.delete(promotion);
    }

    public PromotionDTO map(Promotion promotion) {
        return new PromotionDTO(
                promotion.getPromotionId(),
                promotion.getCode(),
                promotion.getDiscountPercent(),
                promotion.getStartDate(),
                promotion.getEndDate(),
                promotion.getMaxUses(),
                promotion.getHotel().getHotelId()
        );
    }

}