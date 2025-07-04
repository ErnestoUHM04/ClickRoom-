package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.promotion.PromotionDTO;
import TDAW.Hotel_Reservation.dto.reservation.ReservationDTO;
import TDAW.Hotel_Reservation.dto.reservation.ReservationNewStatus;
import TDAW.Hotel_Reservation.dto.reservation.ReservationResponse;
import TDAW.Hotel_Reservation.dto.reservation.ReservationUpdateDTO;
import TDAW.Hotel_Reservation.dto.room.RoomTypeDTO;
import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import TDAW.Hotel_Reservation.entity.reservation.ReservationStatus;
import TDAW.Hotel_Reservation.service.clases.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;

@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;


    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    private ResponseEntity<ReservationResponse> Create(@RequestBody @Valid ReservationDTO reservationDTO){
        ReservationResponse reservationResponse = reservationService.createReservation(reservationDTO);
        URI uri = URI.create("http://localhost:8090/reservation/search/"+reservationResponse.reservationId());
        return ResponseEntity.created(uri).body(reservationResponse);
    }

    @GetMapping("/search/{id}")
    private ResponseEntity<ReservationResponse> FindByReservationId(@PathVariable Long id){
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/search/user/{id}")
    private ResponseEntity<?> FindByUserId(@PathVariable Long id){
        return ResponseEntity.ok(reservationService.getReservationsByUserId(id));
    }

    @GetMapping("/search/date/{date}")
    private ResponseEntity<?> FindByDate(@PathVariable LocalDate date){
        return ResponseEntity.ok(reservationService.getReservationsByDate(date));
    }

    @PostMapping("/search/status")
    private ResponseEntity<?> FindByStatus(@RequestBody ReservationNewStatus reservationNewStatus) {
        return ResponseEntity.ok(reservationService.getReservationsByStatus(reservationNewStatus.reservationStatus()));
    }

    @PutMapping("/update")
    private ResponseEntity<ReservationResponse> Update(@RequestBody ReservationUpdateDTO reservationUpdateDTO){
        return ResponseEntity.ok(reservationService.updateReservation(reservationUpdateDTO));
    }

    @PutMapping("/update/status")
    private ResponseEntity<ReservationResponse> UpdateStatus(@RequestBody @Valid ReservationNewStatus reservationStatus){
        return ResponseEntity.ok(reservationService.NewReservationStatus(reservationStatus));
    }



    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        reservationService.deleteReservation(id);
    }
}
