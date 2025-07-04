package TDAW.Hotel_Reservation.dto.user;

import TDAW.Hotel_Reservation.entity.user.UserRole;
import jakarta.validation.constraints.*;

public record UserLogin(
        Long id,
        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Debe ser un email válido")
        String email,
        @NotBlank(message = "La contraseña no puede estar vacía")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String password,
        String firstName,
        UserRole userRole
) {}
