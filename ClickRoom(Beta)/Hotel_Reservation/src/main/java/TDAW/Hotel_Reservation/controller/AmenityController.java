package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.room.AmenityDTO;
import TDAW.Hotel_Reservation.entity.room.Amenity;
import TDAW.Hotel_Reservation.service.clases.AmenityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/amenity")
public class AmenityController {

    @Autowired
    private AmenityService amenityService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    private ResponseEntity<AmenityDTO> Create(@RequestBody @Valid AmenityDTO amenityDTO){
        Amenity amenity = amenityService.create(amenityDTO);
        URI uri = URI.create("http://localhost:8090/amenity/search/"+amenity.getAmenityId());
        return ResponseEntity.created(uri).body(amenityService.map(amenity));
    }

    @GetMapping("/search/all")
    private ResponseEntity<?> FindAll(@PageableDefault(sort = {"name"}) Pageable pageable){
        return ResponseEntity.ok(amenityService.findAll(pageable));
    }

    @GetMapping("/search/{id}")
    private ResponseEntity<AmenityDTO> FindById(@PathVariable Long id){
        Amenity amenity = amenityService.findById(id);
        return ResponseEntity.ok(amenityService.map(amenity));
    }

    @GetMapping("/search")
    private ResponseEntity<AmenityDTO> FindAllByName(@RequestParam String name){
        Amenity amenity = amenityService.findByName(name);
        return ResponseEntity.ok(amenityService.map(amenity));
    }

    @PutMapping("/update")
    private ResponseEntity<AmenityDTO> Update(@RequestBody AmenityDTO amenityDTO){
        Amenity amenity = amenityService.update(amenityDTO);
        return ResponseEntity.ok(amenityService.map(amenity));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        amenityService.delete(id);
    }

}
