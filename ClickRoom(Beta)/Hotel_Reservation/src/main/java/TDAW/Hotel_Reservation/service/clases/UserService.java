package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.user.*;
import TDAW.Hotel_Reservation.entity.user.User;
import TDAW.Hotel_Reservation.entity.user.UserRole;
import TDAW.Hotel_Reservation.entity.user.admin.Admin;
import TDAW.Hotel_Reservation.entity.user.guest.Guest;
import TDAW.Hotel_Reservation.repository.GuestRepository;
import TDAW.Hotel_Reservation.repository.UserRepository;
import TDAW.Hotel_Reservation.service.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GuestRepository guestRepository;
    @Autowired
    private Validation validation;
    @Autowired
    private ReservationService reservationService;

    public User createAdmin(UserDTO userDTO) {
        switch(userDTO.role()) {
            case GUEST -> {
                throw new IllegalArgumentException("Use createGuest method");
            }
            default -> {
                User user = new Admin();
                user.setEmail(userDTO.email());
                user.setPasswordHash(userDTO.passwordHash());
                user.setFirstName(userDTO.firstName());
                user.setLastName(userDTO.lastName());
                user.setPhone(userDTO.phone());
                user.setRole(userDTO.role());
                user.setBlocked(false);
                return userRepository.save(user);
            }
        }
    }

    public Guest createGuest(GuestDTO guestDTO) {
        Guest guest = new Guest();
        guest.setEmail(guestDTO.email());
        guest.setPasswordHash(guestDTO.passwordHash());
        guest.setFirstName(guestDTO.firstName());
        guest.setLastName(guestDTO.lastName());
        guest.setPhone(guestDTO.phone());
        guest.setRole(UserRole.GUEST);
        guest.setBlocked(false);
        guest.setPassportNumber(guestDTO.passportNumber());
        guest.setNationality(guestDTO.nationality());
        guest.setBirthdate(guestDTO.birthdate());
        return guestRepository.save(guest);
    }

    public UserLogin login(UserLogin userLogin){
        User user = findUserByEmail(userLogin.email());
        if(user.getPasswordHash() != null && user.getPasswordHash().equals(userLogin.password())){
            return new UserLogin(
                    user.getUserId(),
                    user.getEmail(),
                    null,
                    user.getFirstName()
            );
        }else{
            throw new RuntimeException("Password incorrect");
        }
    }

    public User findUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Guest findGuestById(Long id){
        return guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
    }

    public Page<UserResponse> findAllUsers(Pageable pageable){
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::mapUserResponse);
    }

    public Page<GuestResponse> findAllGuests(Pageable pageable){
        Page<Guest> guests = guestRepository.findAll(pageable);
        return guests.map(this::mapGuestResponse);
    }

    public User findUserByEmail(String email){
        User user = userRepository.findByEmail(email.toLowerCase());
        if(user == null) throw new RuntimeException("User not found");
        return user;
    }

    public User updateUser(UserDTO userDTO){
        User user;
        if(userDTO.id() != null){
            user = this.findUserById(userDTO.id());

            if(userDTO.email() != null) {
                validation.validate(userDTO, "email");
                user.setEmail(userDTO.email());
            }

        }else{
            user = this.findUserByEmail(userDTO.email());
        }

        if(userDTO.phone() != null){
            validation.validate(userDTO,"phone");
            user.setPhone(userDTO.phone());
        }

        if(userDTO.passwordHash() != null){
            validation.validate(userDTO,"passwordHash");
            user.setPasswordHash(userDTO.passwordHash());
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id){
        User user = this.findUserById(id);
        userRepository.delete(user);
    }

    public GuestResponse mapGuestResponse(Guest guest){
        return new GuestResponse(
                guest.getUserId(),
                guest.getEmail(),
                guest.getPasswordHash(),
                guest.getFirstName(),
                guest.getLastName(),
                guest.getPhone(),
                guest.getPassportNumber(),
                guest.getNationality(),
                guest.getBirthdate(),
                guest.getReservations().stream()
                        .map(r -> reservationService.map(r))
                        .toList()
        );
    }

    public UserResponse mapUserResponse(User user){
        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone()
        );
    }

}
