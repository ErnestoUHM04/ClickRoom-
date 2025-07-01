package TDAW.Hotel_Reservation.dto.user;

import TDAW.Hotel_Reservation.entity.user.UserRole;
import jakarta.validation.constraints.*;

public record UserDTO(
        Long id,
        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Debe ser un email válido")
        String email,
        @NotBlank(message = "La contraseña no puede estar vacía")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        String passwordHash,
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre no puede superar 50 caracteres")
        String firstName,
        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 50, message = "El nombre no puede superar 50 caracteres")
        String lastName,
        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(
                regexp = "\\+?\\d{7,15}",
                message = "El teléfono debe ser un número válido (7–15 dígitos, opcional ‘+’)"
        )
        String phone,
        @NotNull
        UserRole role
) {}
