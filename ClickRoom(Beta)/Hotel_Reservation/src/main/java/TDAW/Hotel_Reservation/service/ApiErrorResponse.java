package TDAW.Hotel_Reservation.service;

public record ApiErrorResponse(
        String error,
        String message,
        long timestamp
) {
}
