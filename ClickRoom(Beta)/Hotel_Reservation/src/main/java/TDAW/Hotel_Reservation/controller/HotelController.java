package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.hotel.HotelDTO;
import TDAW.Hotel_Reservation.dto.hotel.HotelNoDetail;
import TDAW.Hotel_Reservation.dto.hotel.HotelResponse;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.service.clases.HotelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/hotel")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    private ResponseEntity<HotelNoDetail> Create(@RequestBody @Valid HotelDTO hotelDTO){
        Hotel hotel = hotelService.create(hotelDTO);
        URI uri = URI.create("http://localhost:8090/hotel/search/"+hotel.getHotelId());
        return ResponseEntity.created(uri).body(hotelService.mapNoDetail(hotel));
    }

    @GetMapping("/search/all")
    private ResponseEntity<?> FindAll(@PageableDefault(sort = {"name"}) Pageable pageable){
        return ResponseEntity.ok(hotelService.findAll(pageable));
    }

    @GetMapping("/search/{id}")
    private ResponseEntity<HotelResponse> FindById(@PathVariable Long id){
        Hotel hotel = hotelService.findById(id);
        return ResponseEntity.ok(hotelService.map(hotel));
    }

    @GetMapping("/search")
    private ResponseEntity<HotelResponse> FindAllByName(@RequestParam String destino){
        Hotel hotel = hotelService.findByCity(destino);
        return ResponseEntity.ok(hotelService.map(hotel));
    }

    @PutMapping("/update")
    private ResponseEntity<HotelResponse> Update(@RequestBody HotelDTO hotelDTO){
        Hotel hotel = hotelService.update(hotelDTO);
        return ResponseEntity.ok(hotelService.map(hotel));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        hotelService.delete(id);
    }

}
