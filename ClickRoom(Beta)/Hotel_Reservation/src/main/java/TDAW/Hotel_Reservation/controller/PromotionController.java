package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.promotion.PromotionDTO;
import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import TDAW.Hotel_Reservation.service.clases.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/promotion")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    private ResponseEntity<PromotionDTO> Create(@RequestBody @Valid PromotionDTO promotionDTO){
        Promotion promotion = promotionService.create(promotionDTO);
        URI uri = URI.create("http://localhost:8090/promotion/search/"+promotion.getPromotionId());
        return ResponseEntity.created(uri).body(promotionService.map(promotion));
    }

    @GetMapping("/search/all")
    private ResponseEntity<?> FindAll(@PageableDefault(sort = {"code"}) Pageable pageable){
        return ResponseEntity.ok(promotionService.findAll(pageable));
    }

    @GetMapping("/search/{id}")
    private ResponseEntity<PromotionDTO> FindById(@PathVariable Long id){
        Promotion promotion = promotionService.findById(id);
        return ResponseEntity.ok(promotionService.map(promotion));
    }

    @GetMapping("/search")
    private ResponseEntity<PromotionDTO> FindAllByCode(@RequestParam String code){
        Promotion promotion = promotionService.findByCode(code);
        return ResponseEntity.ok(promotionService.map(promotion));
    }

    @PutMapping("/update")
    private ResponseEntity<PromotionDTO> Update(@RequestBody PromotionDTO promotionDTO){
        Promotion promotion = promotionService.update(promotionDTO);
        return ResponseEntity.ok(promotionService.map(promotion));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        promotionService.delete(id);
    }

}
