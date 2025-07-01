package TDAW.Hotel_Reservation.controller;

import TDAW.Hotel_Reservation.dto.user.*;
import TDAW.Hotel_Reservation.entity.user.User;
import TDAW.Hotel_Reservation.entity.user.guest.Guest;
import TDAW.Hotel_Reservation.service.clases.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> create(@RequestBody @Valid UserDTO userDTO) {
        User created = switch(userDTO.role()) {
            case GUEST -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Use /user/create/guest endpoint for guests");
            default -> userService.createAdmin(userDTO);
        };
        URI uri = URI.create("http://localhost:8090/users/user/search/"+created.getUserId());
        return ResponseEntity.created(uri).body(userService.mapUserResponse(created));
    }

    @PostMapping("/guest/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<GuestResponse> createGuest(@RequestBody @Valid GuestDTO guestDTO) {
        Guest created = userService.createGuest(guestDTO);
        URI uri = URI.create("http://localhost:8090/users/guest/search/"+created.getUserId());
        return ResponseEntity.created(uri).body(userService.mapGuestResponse(created));
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<UserLogin> login(@RequestBody @Valid UserLogin userLogin) {
        System.out.println("========== LOGIN REQUEST RECEIVED ==========");
        System.out.println("Email recibido: " + userLogin.email());
        System.out.println("Password recibido: " + userLogin.password());
        UserLogin user = userService.login(userLogin);
        System.out.println("Login exitoso para usuario con email: " + user.email());
        System.out.println("============================================");
        return ResponseEntity.accepted().body(user);
    }

    @GetMapping("/user/search/{id}")
    private ResponseEntity<UserResponse> FindUserById(@PathVariable Long id){
        User user = userService.findUserById(id);
        return ResponseEntity.ok(userService.mapUserResponse(user));
    }

    @GetMapping("/guest/search/{id}")
    private ResponseEntity<GuestResponse> FindGuestById(@PathVariable Long id){
        Guest guest = userService.findGuestById(id);
        return ResponseEntity.ok(userService.mapGuestResponse(guest));
    }

    @GetMapping("/user/search/all")
    private ResponseEntity<?> FindAllUsers(@PageableDefault(sort = {"firstName"}) Pageable pageable){
        return ResponseEntity.ok(userService.findAllUsers(pageable));
    }

    @GetMapping("/guest/search/all")
    private ResponseEntity<?> FindAllGuests(@PageableDefault(sort = {"firstName"}) Pageable pageable){
        return ResponseEntity.ok(userService.findAllGuests(pageable));
    }

    @GetMapping("/search")
    private ResponseEntity<UserResponse> FindUserByEmail(@RequestParam String email){
        User user = userService.findUserByEmail(email);
        return ResponseEntity.ok(userService.mapUserResponse(user));
    }

    @PutMapping("/update")
    private ResponseEntity<UserResponse> Update(@RequestBody UserDTO userDTO){
        User user = userService.updateUser(userDTO);
        return ResponseEntity.ok(userService.mapUserResponse(user));
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    private void Delete(@PathVariable Long id){
        userService.deleteUser(id);
    }

}