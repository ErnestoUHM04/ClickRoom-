package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.room.RoomTypeDTO;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import TDAW.Hotel_Reservation.service.clases.RoomTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/room-type")
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    private ResponseEntity<RoomTypeDTO> Create(@RequestBody @Valid RoomTypeDTO roomTypeDTO){
        RoomType roomType = roomTypeService.create(roomTypeDTO);
        URI uri = URI.create("http://localhost:8090/room-type/search/"+roomType.getRoomTypeId());
        return ResponseEntity.created(uri).body(roomTypeService.map(roomType));
    }

    @GetMapping("/search/all")
    private ResponseEntity<?> FindAll(@PageableDefault(sort = {"name"}) Pageable pageable){
        return ResponseEntity.ok(roomTypeService.findAll(pageable));
    }

    @GetMapping("/search/{id}")
    private ResponseEntity<RoomTypeDTO> FindById(@PathVariable Long id){
        RoomType roomType = roomTypeService.findById(id);
        return ResponseEntity.ok(roomTypeService.map(roomType));
    }

    @GetMapping("/search")
    private ResponseEntity<RoomTypeDTO> FindAllByName(@RequestParam String name){
        RoomType roomType = roomTypeService.findByName(name);
        return ResponseEntity.ok(roomTypeService.map(roomType));
    }

    @PutMapping("/update")
    private ResponseEntity<RoomTypeDTO> Update(@RequestBody RoomTypeDTO roomTypeDTO){
        RoomType roomType = roomTypeService.update(roomTypeDTO);
        return ResponseEntity.ok(roomTypeService.map(roomType));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        roomTypeService.delete(id);
    }
}
