package TDAW.Hotel_Reservation.dto.user;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record GuestDTO(
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
        @NotBlank(message = "El número de pasaporte es obligatorio")
        @Pattern(
                // Ejemplo: 6–9 caracteres alfanuméricos
                regexp = "[A-Z0-9]{6,9}",
                message = "Número de pasaporte inválido"
        )
        String passportNumber,
        @NotBlank(message = "La nacionalidad es obligatoria")
        @Size(max = 50, message = "La nacionalidad no puede superar 50 caracteres")
        String nationality,
        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser en el pasado")
        LocalDate birthdate
) {}