package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.reservation.ReservationDTO;
import TDAW.Hotel_Reservation.dto.reservation.ReservationResponse;
import TDAW.Hotel_Reservation.dto.reservation.ReservationUpdateDTO;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.entity.promotion.Promotion;
import TDAW.Hotel_Reservation.entity.reservation.Reservation;
import TDAW.Hotel_Reservation.entity.reservation.ReservationRoom;
import TDAW.Hotel_Reservation.entity.reservation.ReservationRoomId;
import TDAW.Hotel_Reservation.entity.reservation.ReservationStatus;
import TDAW.Hotel_Reservation.entity.room.Room;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import TDAW.Hotel_Reservation.entity.user.guest.Guest;
import TDAW.Hotel_Reservation.repository.*;
import TDAW.Hotel_Reservation.service.Validation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class ReservationService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private HotelService hotelService;
    @Autowired
    private GuestRepository guestRepository;
    @Autowired
    private RoomTypeService roomTypeService;
    @Autowired
    private PromotionService promotionService;
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private Validation validation;

    public ReservationResponse createReservation(ReservationDTO request) {
        // 1. Validar y obtener entidades relacionadas
        Hotel hotel = hotelService.findById(request.hotelId());
        RoomType roomType = roomTypeService.findById(request.roomTypeId());

        Guest guest = guestRepository.findById(request.guestId())
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        if (request.checkOut().isBefore(request.checkIn()) || request.checkOut().equals(request.checkIn())) {
            throw new IllegalArgumentException("La fecha de check-out debe ser posterior al check-in");
        }

        // 2. Generar rango de fechas
        List<LocalDate> dates = request.checkIn().datesUntil(request.checkOut().plusDays(1)).toList();
        int totalNights = dates.size();

        // 3. Buscar todas las habitaciones del tipo en el hotel
        List<Room> allRooms = roomRepository.findAllRoomsByHotelAndType(
                hotel.getHotelId(), roomType.getRoomTypeId());

        // 4. Filtrar habitaciones disponibles para todo el rango de fechas
        List<Room> availableRooms = allRooms.stream()
                .filter(room -> room.getBooking().stream().noneMatch(dates::contains))
                .limit(request.number())
                .toList();

        if (availableRooms.size() < request.number()) {
            throw new RuntimeException("No hay suficientes habitaciones disponibles en ese rango de fechas.");
        }

        // 5. Crear reservación base
        Reservation reservation = new Reservation();
        reservation.setGuest(guest);
        reservation.setHotel(hotel);

        reservation.setCheckIn(request.checkIn());
        reservation.setCheckOut(request.checkOut());
        reservation.setStatus(ReservationStatus.PENDING);

        // Persistimos inicialmente para obtener el ID
        Reservation savedReservation = reservationRepository.save(reservation);

        // 6. Asociar habitaciones con la reservación
        BigDecimal total = BigDecimal.ZERO;

        for (Room room : availableRooms) {
            // Marcar fechas como reservadas
            room.getBooking().addAll(dates);
            roomRepository.save(room);

            // Crear entidad intermedia con clave compuesta
            ReservationRoomId rrId = new ReservationRoomId();
            rrId.setReservationId(savedReservation.getReservationId());
            rrId.setRoomId(room.getRoomId());

            ReservationRoom rr = new ReservationRoom();
            rr.setId(rrId);
            rr.setReservation(savedReservation);
            rr.setRoom(room);

            BigDecimal taxes = room.getBasePrice()
                    .multiply(new BigDecimal(totalNights))
                    .multiply(new BigDecimal("0.16"));
            BigDecimal finalPrice = (room.getBasePrice()
                    .multiply(new BigDecimal(totalNights))).add(taxes);

            rr.setTaxes(taxes);
            rr.setFinalPrice(finalPrice);

            savedReservation.getRooms().add(rr);
            total = total.add(finalPrice);
        }

        // 7. Calcular descuentos si hay código promocional
        BigDecimal discount = BigDecimal.ZERO;
        if (request.code() != null && promotionService.use(request.code())) {
            discount = promotionService.findByCode(request.code()).getDiscountPercent().divide(new BigDecimal("100"));
        }

        BigDecimal finalPrice = total.subtract(total.multiply(discount));

        savedReservation.setTotal(total);
        savedReservation.setDiscount(discount);
        savedReservation.setFinalPrice(finalPrice);

        // 8. Guardar reservación actualizada con montos finales
        Reservation finalReservation = reservationRepository.save(savedReservation);

        // 9. Construir y retornar respuesta
        return new ReservationResponse(
                finalReservation.getReservationId(),
                guest.getUserId(),
                hotel.getHotelId(),
                request.number(),
                roomType.getName(),
                request.checkIn(),
                request.checkOut(),
                finalReservation.getStatus(),
                finalReservation.getTotal(),
                finalReservation.getDiscount(),
                finalReservation.getFinalPrice()
        );
    }

    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservación no encontrada con ID: " + id));

        return this.map(reservation);
    }

    public List<ReservationResponse> getReservationsByUserId(Long userId) {
        List<Reservation> reservations = reservationRepository.findByGuest(userId);

        return reservations.stream()
                .map(this::map)
                .toList();
    }

    public List<ReservationResponse> getReservationsByDate(LocalDate date) {
        List<Reservation> reservations = reservationRepository
                .findByCheckInLessThanEqualAndCheckOutGreaterThanEqual(date, date);

        return reservations.stream()
                .map(this::map)
                .toList();
    }

    public ReservationResponse updateReservation(ReservationUpdateDTO reservationUpdateDTO) {
        // 1. Validar y obtener la reservación existente
        Long reservationId = reservationUpdateDTO.reservationId();
        validation.validate(reservationUpdateDTO, "reservationId");
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservación no encontrada con ID: " + reservationId));

        // 2. Determinar nuevos valores finales (check-in, check-out, tipo de habitación, cantidad)
        LocalDate originalCheckIn = reservation.getCheckIn();
        LocalDate originalCheckOut = reservation.getCheckOut();
        LocalDate finalCheckIn = (reservationUpdateDTO.newCheckIn() != null)
                ? reservationUpdateDTO.newCheckIn()
                : originalCheckIn;
        LocalDate finalCheckOut = (reservationUpdateDTO.newCheckOut() != null)
                ? reservationUpdateDTO.newCheckOut()
                : originalCheckOut;
        long finalRoomCount = (reservationUpdateDTO.newRoomCount() != null)
                ? reservationUpdateDTO.newRoomCount()
                : reservation.getRooms().size();
        Long newRoomTypeId = reservationUpdateDTO.newRoomTypeId();
        String newDiscountCode = reservationUpdateDTO.newDiscountCode();

        // Validar que las fechas estén en orden y que la nueva fecha de check-in sea al menos un día después de hoy
        if (finalCheckOut.isBefore(finalCheckIn) || finalCheckOut.equals(finalCheckIn)) {
            throw new IllegalArgumentException("La fecha de check-out debe ser posterior al check-in");
        }
        if ((reservationUpdateDTO.newCheckIn() != null || reservationUpdateDTO.newCheckOut() != null)
                && !finalCheckIn.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de check-in debe ser al menos un día posterior a la fecha actual");
        }
        if (finalRoomCount <= 0) {
            throw new IllegalArgumentException("El número de habitaciones debe ser al menos 1");
        }

        // Obtener el tipo de habitación actual y determinar el tipo final
        RoomType currentRoomType = reservation.getRooms().isEmpty()
                ? null
                : reservation.getRooms().get(0).getRoom().getRoomType();
        RoomType finalRoomType = (newRoomTypeId != null)
                ? roomTypeService.findById(newRoomTypeId)
                : currentRoomType;

        // 3. Si se solicita cambiar el tipo de habitación, intentar crear una nueva reservación
        if (newRoomTypeId != null && (currentRoomType == null
                || !finalRoomType.getRoomTypeId().equals(currentRoomType.getRoomTypeId()))) {
            // Construir un DTO para la nueva reservación con los datos actualizados
            ReservationDTO nuevaReservaDTO = new ReservationDTO(
                    reservation.getHotel().getHotelId(),
                    finalRoomType.getRoomTypeId(),
                    finalRoomCount,
                    finalCheckIn,
                    finalCheckOut,
                    reservation.getGuest().getUserId(),
                    newDiscountCode
            );
            try {
                // Intentar crear la nueva reservación con los datos proporcionados
                ReservationResponse nuevaReserva = this.createReservation(nuevaReservaDTO);
                // Si la nueva reservación se creó con éxito, eliminar la reservación anterior
                this.deleteReservation(reservationId);
                // Retornar los detalles de la nueva reservación
                return nuevaReserva;
            } catch (Exception e) {
                // Si no se puede crear la nueva reservación, conservar la reservación original sin cambios
                return this.map(reservation);
            }
        }

        // 4. Si no se cambia el tipo de habitación, proceder a actualizar la reservación existente
        List<LocalDate> originalDates = getDatesBetween(originalCheckIn, originalCheckOut.plusDays(1));
        List<LocalDate> newDates = getDatesBetween(finalCheckIn, finalCheckOut.plusDays(1));

        // Preparar lista de habitaciones actuales que se pueden conservar (sin conflictos en las nuevas fechas)
        List<Room> roomsToKeep = new ArrayList<>();
        for (ReservationRoom rr : reservation.getRooms()) {
            roomsToKeep.add(rr.getRoom());
        }
        // Remover de roomsToKeep cualquier habitación que tenga conflictos de fecha en newDates (excluyendo sus propias fechas originales)
        roomsToKeep.removeIf(room -> {
            List<LocalDate> otherBookings = new ArrayList<>(room.getBooking());
            otherBookings.removeAll(originalDates);  // quitar las fechas de esta reservación de la lista de bookings de la habitación
            // Si alguna de las nuevas fechas está en las otras reservas de la habitación, existe un conflicto
            return newDates.stream().anyMatch(otherBookings::contains);
        });

        // Ajustar la lista de habitaciones a conservar según el nuevo número de habitaciones requerido
        while (roomsToKeep.size() > finalRoomCount) {
            roomsToKeep.remove(roomsToKeep.size() - 1);  // remover habitaciones extra si hay más de las necesarias
        }

        // Calcular cuántas habitaciones adicionales se necesitan reservar
        long roomsNeeded = finalRoomCount - roomsToKeep.size();
        List<Room> newRoomsToAdd = new ArrayList<>();
        if (roomsNeeded > 0) {
            // Buscar todas las habitaciones del tipo y hotel que estén disponibles en el rango de nuevas fechas
            List<Room> candidates = roomRepository.findAllRoomsByHotelAndType(
                    reservation.getHotel().getHotelId(), finalRoomType.getRoomTypeId());
            for (Room candidate : candidates) {
                if (roomsToKeep.contains(candidate)) continue;  // saltar habitaciones ya retenidas
                boolean available = newDates.stream().noneMatch(candidate.getBooking()::contains);
                if (available) {
                    newRoomsToAdd.add(candidate);
                }
                if (newRoomsToAdd.size() == roomsNeeded) break;
            }
            // Si no hay suficientes habitaciones disponibles, intentar crear una nueva reservación (misma habitación y fechas)
            if (newRoomsToAdd.size() < roomsNeeded) {
                ReservationDTO nuevaReservaDTO = new ReservationDTO(
                        reservation.getHotel().getHotelId(),
                        finalRoomType.getRoomTypeId(),
                        finalRoomCount,
                        finalCheckIn,
                        finalCheckOut,
                        reservation.getGuest().getUserId(),
                        newDiscountCode
                );
                try {
                    ReservationResponse nuevaReserva = this.createReservation(nuevaReservaDTO);
                    this.deleteReservation(reservationId);
                    return nuevaReserva;
                } catch (Exception e) {
                    // No se pudo crear la nueva reservación; mantener la original sin cambios
                    return this.map(reservation);
                }
            }
        }

        // 5. Actualizar los campos principales de la reservación existente (fechas, etc.)
        reservation.setCheckIn(finalCheckIn);
        reservation.setCheckOut(finalCheckOut);

        // 6. Manejar el código de descuento: aplicar el nuevo si existe, o remover el anterior si no se proporcionó
        BigDecimal discountPercent = BigDecimal.ZERO;
        if (newDiscountCode != null && !newDiscountCode.isBlank() && promotionRepository.existsByCode(newDiscountCode)) {
            Promotion promo = promotionService.findByCode(newDiscountCode);
            if (promo.getDiscountPercent() != null) {
                discountPercent = promo.getDiscountPercent().divide(BigDecimal.valueOf(100));
            }
        }
        // Si no se proporcionó un nuevo código válido, discountPercent permanece en 0 (sin descuento).

        // 7. Remover habitaciones que ya no se usarán en la reservación (liberar sus fechas en booking)
        Iterator<ReservationRoom> iterator = reservation.getRooms().iterator();
        while (iterator.hasNext()) {
            ReservationRoom rr = iterator.next();
            Room room = rr.getRoom();
            if (!roomsToKeep.contains(room)) {
                iterator.remove();  // quitar la habitación de la reservación
                // Liberar las fechas originales de la reservación en el calendario (booking) de la habitación
                for (LocalDate date : originalDates) {
                    room.getBooking().remove(date);
                }
                roomRepository.save(room);
            }
        }

        // 8. Agregar nuevas habitaciones a la reservación (y marcar sus fechas como ocupadas)
        for (Room room : newRoomsToAdd) {
            // Crear la relación ReservationRoom para la nueva habitación
            ReservationRoomId rrId = new ReservationRoomId(reservation.getReservationId(), room.getRoomId());
            ReservationRoom newRR = new ReservationRoom();
            newRR.setId(rrId);
            newRR.setReservation(reservation);
            newRR.setRoom(room);
            newRR.setTaxes(BigDecimal.ZERO);
            newRR.setFinalPrice(BigDecimal.ZERO);
            reservation.getRooms().add(newRR);
            // Marcar las nuevas fechas como ocupadas en el booking de la habitación
            room.getBooking().addAll(newDates);
            roomRepository.save(room);
        }

        // 9. Actualizar las habitaciones conservadas con las nuevas fechas (si las fechas cambiaron)
        if (!newDates.equals(originalDates)) {
            for (Room room : roomsToKeep) {
                room.getBooking().removeAll(originalDates);
                room.getBooking().addAll(newDates);
                roomRepository.save(room);
            }
        }

        // 10. Recalcular el costo de la reservación (precios por habitación, impuestos, descuento y total)
        int nights = (int) ChronoUnit.DAYS.between(finalCheckIn, finalCheckOut.plusDays(1));
        BigDecimal totalBeforeDiscount = BigDecimal.ZERO;
        for (ReservationRoom rr : reservation.getRooms()) {
            Room room = rr.getRoom();
            BigDecimal base = room.getBasePrice().multiply(BigDecimal.valueOf(nights));
            BigDecimal taxes = base.multiply(new BigDecimal("0.16"));
            BigDecimal roomTotal = base.add(taxes);
            // Actualizar el precio de la habitación en la relación (antes de descuento)
            rr.setTaxes(taxes);
            rr.setFinalPrice(roomTotal);
            totalBeforeDiscount = totalBeforeDiscount.add(roomTotal);
        }

        // Calcular el monto de descuento (si corresponde) y el precio final con descuento
        BigDecimal discountAmount = totalBeforeDiscount.multiply(discountPercent);
        if (discountAmount.compareTo(totalBeforeDiscount) > 0) {
            discountAmount = totalBeforeDiscount;
        }
        BigDecimal finalTotal = totalBeforeDiscount.subtract(discountAmount);

        // Actualizar montos totales en la entidad Reservation
        reservation.setTotal(totalBeforeDiscount);
        reservation.setDiscount(discountAmount);
        reservation.setFinalPrice(finalTotal);

        // 11. Guardar los cambios en la base de datos y retornar la respuesta de la reservación actualizada
        reservationRepository.save(reservation);
        return this.map(reservation);
    }

    // Función auxiliar: crea una nueva reservación a partir de los datos de actualización.
    // Se usa en caso de cambiar el tipo de habitación o como fallback si no se puede modificar directamente la existente.
    private ReservationResponse createNewReservationFromUpdateDTO(Reservation oldReservation, ReservationUpdateDTO updateDTO) {
        // Reunir datos para la nueva reservación
        Long hotelId = oldReservation.getHotel().getHotelId();
        Long guestId = oldReservation.getGuest().getUserId();
        Long roomTypeId = (updateDTO.newRoomTypeId() != null)
                ? updateDTO.newRoomTypeId()
                : oldReservation.getRooms().get(0).getRoom().getRoomType().getRoomTypeId();
        LocalDate checkIn = (updateDTO.newCheckIn() != null) ? updateDTO.newCheckIn() : oldReservation.getCheckIn();
        LocalDate checkOut = (updateDTO.newCheckOut() != null) ? updateDTO.newCheckOut() : oldReservation.getCheckOut();
        Long roomCount = (updateDTO.newRoomCount() != null) ? updateDTO.newRoomCount() : (long) oldReservation.getRooms().size();
        String discountCode = updateDTO.newDiscountCode();  // puede ser null

        // Construir objeto de solicitud para crear reservación
        ReservationDTO newReservationRequest = new ReservationDTO(hotelId, roomTypeId, guestId, checkIn, checkOut, roomCount, discountCode);
        // Invocar creación de nueva reservación. Esto lanza excepción si no hay disponibilidad.
        ReservationResponse newResResponse = this.createReservation(newReservationRequest);
        return newResResponse;
    }

    // Función auxiliar: cancela (elimina) una reservación existente, liberando las habitaciones.
    // Se utiliza después de crear una nueva reservación (escenario de cambio de tipo o fallback)
    // para quitar la reservación antigua del sistema.
    private void cancelReservation(Reservation reservation) {
        // Obtener todas las fechas que abarcaba la reservación
        List<LocalDate> dates = getDatesBetween(reservation.getCheckIn(), reservation.getCheckOut());
        // Liberar cada habitación reservada en esas fechas
        for (ReservationRoom rr : reservation.getRooms()) {
            Room room = rr.getRoom();
            room.getBooking().removeAll(dates);    // quitar todas las fechas ocupadas por esta reservación
            roomRepository.save(room);
        }
        // Eliminar la reservación de la lista del huésped (si existe relación bidireccional)
        reservation.getGuest().getReservations().remove(reservation);
        // Eliminar la entidad Reservation (se asume que ReservationRoom se elimina en cascada/orphanRemoval)
        reservationRepository.delete(reservation);
    }

    // Función auxiliar: verifica si una habitación está disponible para un conjunto de fechas dado.
    // Parametro `ignoreDates` permite excluir ciertas fechas (por ejemplo, las fechas previamente reservadas por la misma reservación).
    private boolean isRoomAvailableForDates(Room room, List<LocalDate> newDates, List<LocalDate> ignoreDates) {
        // Obtenemos todas las fechas ya reservadas en la habitación
        List<LocalDate> bookedDates = new ArrayList<>(room.getBooking());
        if (ignoreDates != null) {
            // Ignorar (remover) las fechas de la reservación original para evitar auto-conflictos
            bookedDates.removeAll(ignoreDates);
        }
        // La habitación estará disponible si ninguna de las newDates está presente en bookedDates
        // (es decir, no hay intersección entre las nuevas fechas deseadas y las ocupadas por otras reservas)
        for (LocalDate date : newDates) {
            if (bookedDates.contains(date)) {
                return false;  // existe un conflicto en esta fecha
            }
        }
        return true;
        // Equivalente funcional:
        // return newDates.stream().noneMatch(bookedDates::contains);
    }

    // Función auxiliar: actualiza las fechas reservadas de una habitación, reemplazando el rango antiguo por el nuevo.
    // Remueve todas las fechas de `oldDates` de la lista de reservas de la habitación y agrega todas las `newDates`.
    private void updateBookingDates(Room room, List<LocalDate> oldDates, List<LocalDate> newDates) {
        // Eliminar las fechas antiguas de la ocupación
        if (oldDates != null) {
            room.getBooking().removeAll(oldDates);
        }
        // Agregar las nuevas fechas a la ocupación
        room.getBooking().addAll(newDates);
        // Guardar los cambios en la habitación
        roomRepository.save(room);
    }

    // Función auxiliar: recalcula el costo total, impuestos y descuento de una reservación según su estado actual.
    // Aplica el nuevo código de descuento si está presente; si no, elimina cualquier descuento previo.
    private void recalculateReservationPricing(Reservation reservation, String newDiscountCode) {
        // Calcular el número de noches en el nuevo rango
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        if (nights <= 0) {
            nights = 0;  // por seguridad, aunque la validación anterior evita nights <= 0
        }
        BigDecimal totalBeforeDiscount = BigDecimal.ZERO;
        // Recalcular precio por habitación
        for (ReservationRoom rr : reservation.getRooms()) {
            Room room = rr.getRoom();
            // Costo base por habitación (tarifa * noches) y sus impuestos
            BigDecimal baseCost = room.getBasePrice().multiply(BigDecimal.valueOf(nights));
            BigDecimal taxes = baseCost.multiply(new BigDecimal("0.16"));  // impuesto 16%
            // Actualizar en la relación
            rr.setTaxes(taxes);
            rr.setFinalPrice(baseCost.add(taxes));  // precio de la habitación con impuestos (sin descuento)
            // Acumular totales
            totalBeforeDiscount = totalBeforeDiscount.add(rr.getFinalPrice());
        }
        // Calcular descuento a aplicar
        BigDecimal discountPercent = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (newDiscountCode != null && !newDiscountCode.isBlank() && promotionRepository.existsByCode(newDiscountCode)) {
            Promotion promo = promotionService.findByCode(newDiscountCode);
            if (promo.getDiscountPercent() != null) {
                // Obtener porcentaje de descuento (e.g., 10% -> 0.10)
                discountPercent = promo.getDiscountPercent().divide(BigDecimal.valueOf(100));
                // Monto absoluto de descuento = porcentaje * total antes de descuento
                discountAmount = totalBeforeDiscount.multiply(discountPercent);
            }
        } else {
            // Si no hay nuevo código, no aplicar ningún descuento (remover descuento anterior)
            discountPercent = BigDecimal.ZERO;
            discountAmount = BigDecimal.ZERO;
        }
        // Asegurarse de no descontar más del total (por si acaso)
        if (discountAmount.compareTo(totalBeforeDiscount) > 0) {
            discountAmount = totalBeforeDiscount;
        }
        // Calcular total final después del descuento
        BigDecimal finalTotal = totalBeforeDiscount.subtract(discountAmount);
        // Actualizar campos monetarios en la reservación
        reservation.setTotal(totalBeforeDiscount);
        reservation.setDiscount(discountPercent);   // guardar el porcentaje de descuento aplicado (o 0)
        reservation.setFinalPrice(finalTotal);
    }

    // Método auxiliar para obtener la lista de fechas entre dos LocalDate (rango semi-abierto [start, end))
    private List<LocalDate> getDatesBetween(LocalDate start, LocalDate end) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate date = start;
        while (date.isBefore(end)) {
            dates.add(date);
            date = date.plusDays(1);
        }
        return dates;
    }

    @Transactional
    public void deleteReservation(Long reservationId) {
        // 1. Buscar la reservación
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservación no encontrada con ID: " + reservationId));

        // 2. Generar lista de fechas a liberar
        List<LocalDate> dates = reservation.getCheckIn()
                .datesUntil(reservation.getCheckOut().plusDays(1))
                .toList();

        // 3. Liberar las fechas en cada habitación asociada
        for (ReservationRoom rr : reservation.getRooms()) {
            Room room = rr.getRoom();
            room.getBooking().removeIf(dates::contains);
            roomRepository.save(room);
        }

        reservation.getGuest().getReservations().remove(reservation);

        // 4. Eliminar la reservación (se eliminan ReservationRoom si están en cascade)
        reservationRepository.delete(reservation);
    }


    public ReservationResponse map(Reservation reservation){
        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getGuest().getUserId(),
                reservation.getHotel().getHotelId(),
                (long) reservation.getRooms().size(),
                reservation.getRooms().get(0).getRoom().getRoomType().getName(),
                reservation.getCheckIn(),
                reservation.getCheckOut(),
                reservation.getStatus(),
                reservation.getTotal(),
                reservation.getDiscount(),
                reservation.getFinalPrice()
        );
    }
}
