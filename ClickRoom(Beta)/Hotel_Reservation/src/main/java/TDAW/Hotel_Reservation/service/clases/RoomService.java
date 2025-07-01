package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import TDAW.Hotel_Reservation.dto.room.RoomNoDetail;
import TDAW.Hotel_Reservation.dto.room.RoomResponse;
import TDAW.Hotel_Reservation.dto.room.RoomTypeDTO;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.entity.room.Room;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import TDAW.Hotel_Reservation.repository.HotelRepository;
import TDAW.Hotel_Reservation.repository.RoomRepository;
import TDAW.Hotel_Reservation.service.Validation;
import TDAW.Hotel_Reservation.service.interfaces.IRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService implements IRoomService {

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    HotelRepository hotelRepository;

    @Autowired
    RoomTypeService roomTypeService;

    @Autowired
    private Validation validation;

    @Override
    public Room create(RoomDTO roomDTO) {

        RoomType roomType;
        RoomTypeDTO roomTypeDTO = roomDTO.roomTypeDTO();
        if(roomTypeDTO.id() != null){
            roomType = roomTypeService.findById(roomTypeDTO.id());
        }else{
            roomType = roomTypeService.findByNameNoException(roomTypeDTO.name());

            if(roomType == null){
                validation.validate(roomTypeDTO, "all");

                roomType = roomTypeService.create(roomTypeDTO);
            }
        }

        Hotel hotel = hotelRepository.findById(roomDTO.hotelID())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = new Room(
                null,
                hotel,
                roomType,
                roomDTO.basePrice(),
                new ArrayList<>()
        );

        return roomRepository.save(room);
    }

    @Override
    public Room findById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Override
    public Page<RoomResponse> findAll(Pageable pageable) {
        Page<Room> rooms = roomRepository.findAll(pageable);
        return rooms.map(this::map);
    }

    @Override
    public Room update(RoomDTO roomDTO) {
        Room room = this.findById(roomDTO.id());

        if(roomDTO.basePrice() != null){
            room.setBasePrice(roomDTO.basePrice());
        }

        RoomTypeDTO roomTypeDTO = roomDTO.roomTypeDTO();
        if(roomTypeDTO != null){
            RoomType roomType;
            if(roomTypeDTO.id() != null){
                roomType = roomTypeService.findById(roomTypeDTO.id());
            }else{
                roomType = roomTypeService.findByNameNoException(roomTypeDTO.name());

                if(roomType == null){
                    validation.validate(roomTypeDTO, "all");

                    roomType = roomTypeService.create(roomTypeDTO);
                }
            }
            room.setRoomType(roomType);
        }

        return roomRepository.save(room);
    }

    @Override
    public Boolean book(Long id, LocalDate localDate) {
        Room room = this.findById(id);

        if(room.getBooking().stream().anyMatch(ld -> ld.isEqual(localDate))){
            return false;
        }else{
            room.getBooking().add(localDate);
            roomRepository.save(room);
            return true;
        }
    }

    @Override
    public Boolean unbook(Long id, LocalDate localDate) {
        Room room = this.findById(id);

        if(room.getBooking().stream().anyMatch(ld -> ld.isEqual(localDate))){
            room.getBooking().remove(localDate);
            roomRepository.save(room);
            return false;
        }else return  false;
    }

    @Override
    public void delete(Long id) {
        Room room = this.findById(id);

        Hotel hotel = room.getHotel();
        if (hotel != null) {
            hotel.getRooms().remove(room);
        }

        roomRepository.delete(room);
    }

    public List<RoomNoDetail> getRoomsNoDetail(List<Room> rooms){

        List<RoomNoDetail> roomNoDetails = new ArrayList<>();

        Map<RoomType, AbstractMap.SimpleEntry<BigDecimal, Long>> result = rooms.stream()
                .collect(Collectors.toMap(
                        Room::getRoomType,
                        room -> new AbstractMap.SimpleEntry<>(room.getBasePrice(), 1L),
                        (entry1, entry2) -> new AbstractMap.SimpleEntry<>(
                                entry1.getKey(),                  // Usamos el primer basePrice encontrado
                                entry1.getValue() + entry2.getValue() // Sumamos los conteos
                        )
                ));

        result.forEach((roomType, bigDecimalLongSimpleEntry) -> {
            RoomNoDetail roomNoDetail = new RoomNoDetail(
                    roomTypeService.map(roomType),
                    bigDecimalLongSimpleEntry.getValue(),
                    bigDecimalLongSimpleEntry.getKey()
            );
            roomNoDetails.add(roomNoDetail);
        });

        return roomNoDetails;
    }

    public RoomDTO mapDTO(Room room){
        return new RoomDTO(
                room.getRoomId(),
                room.getHotel().getHotelId(),
                roomTypeService.map(room.getRoomType()),
                room.getBasePrice()
        );
    }

    public RoomResponse map(Room room){
        return new RoomResponse(
                room.getRoomId(),
                room.getHotel().getHotelId(),
                room.getHotel().getName(),
                roomTypeService.map(room.getRoomType()),
                room.getBasePrice()
        );
    }

}
