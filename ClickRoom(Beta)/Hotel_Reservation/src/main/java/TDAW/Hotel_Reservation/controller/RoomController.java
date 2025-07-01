package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import TDAW.Hotel_Reservation.dto.room.RoomResponse;
import TDAW.Hotel_Reservation.entity.room.Room;
import TDAW.Hotel_Reservation.service.clases.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    private ResponseEntity<RoomDTO> Create(@RequestBody @Valid RoomDTO roomDTO){
        Room room = roomService.create(roomDTO);
        URI uri = URI.create("http://localhost:8090/room/search/"+room.getRoomId());
        return ResponseEntity.created(uri).body(roomService.mapDTO(room));
    }

    @GetMapping("/search/all")
    private ResponseEntity<?> FindAll(@PageableDefault(sort = {"basePrice"}) Pageable pageable){
        return ResponseEntity.ok(roomService.findAll(pageable));
    }

    @GetMapping("/search/{id}")
    private ResponseEntity<RoomResponse> FindById(@PathVariable Long id){
        Room room = roomService.findById(id);
        return ResponseEntity.ok(roomService.map(room));
    }

    @PutMapping("/update")
    private ResponseEntity<RoomResponse> Update(@RequestBody RoomDTO roomDTO){
        Room room = roomService.update(roomDTO);
        return ResponseEntity.ok(roomService.map(room));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        roomService.delete(id);
    }

}
