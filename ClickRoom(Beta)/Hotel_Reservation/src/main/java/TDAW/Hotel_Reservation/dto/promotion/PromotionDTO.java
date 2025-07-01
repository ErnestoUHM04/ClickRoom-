package TDAW.Hotel_Reservation.dto.promotion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PromotionDTO(
        Long id,
        @NotBlank
        String code,
        @NotNull
        BigDecimal discountPercent,
        @NotNull
        LocalDate startDate,
        @NotNull
        LocalDate endDate,
        @NotNull
        Integer maxUses,
        @NotNull
        Long hotelID
) {}
