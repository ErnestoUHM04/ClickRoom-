package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.hotel.HotelDTO;
import TDAW.Hotel_Reservation.dto.hotel.HotelNoDetail;
import TDAW.Hotel_Reservation.dto.hotel.HotelResponse;
import TDAW.Hotel_Reservation.dto.room.RoomDTO;
import TDAW.Hotel_Reservation.dto.room.RoomTypeDTO;
import TDAW.Hotel_Reservation.entity.hotel.Hotel;
import TDAW.Hotel_Reservation.entity.room.Room;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import TDAW.Hotel_Reservation.repository.AmenityRepository;
import TDAW.Hotel_Reservation.repository.HotelRepository;
import TDAW.Hotel_Reservation.repository.RoomRepository;
import TDAW.Hotel_Reservation.repository.RoomTypeRepository;
import TDAW.Hotel_Reservation.service.Validation;
import TDAW.Hotel_Reservation.service.interfaces.IHotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class HotelService implements IHotelService {

    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private RoomService roomService;
    @Autowired
    private PromotionService promotionService;
    @Autowired
    private Validation validation;

    @Override
    public Hotel create(HotelDTO hotelDTO) {

        Integer star = 0;
        if(hotelDTO.stars() != null) star = hotelDTO.stars();

        Hotel hotel = new Hotel(
                null,
                hotelDTO.name(),
                hotelDTO.address(),
                hotelDTO.city(),
                hotelDTO.country(),
                hotelDTO.postalCode(),
                hotelDTO.phone(),
                hotelDTO.email(),
                star,
                hotelDTO.checkInTime(),
                hotelDTO.checkOutTime(),
                hotelDTO.description(),
                new ArrayList<>(),
                new ArrayList<>()
                );

        Hotel savedHotel = hotelRepository.save(hotel);

        List<Room> rooms = hotelDTO.roomDTOS().stream().map(roomDTO -> {
            RoomDTO roomDTO1 = new RoomDTO(
                    null,
                    savedHotel.getHotelId(),
                    roomDTO.roomTypeDTO(),
                    roomDTO.basePrice()
            );

            validation.validate(roomDTO1,"all");
            return roomService.create(roomDTO1);
        }).toList();

        savedHotel.setRooms(new ArrayList<>(rooms));

        return savedHotel;
    }

    @Override
    public Hotel findById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    @Override
    public Hotel findByName(String name) {
        Hotel hotel = hotelRepository.findByName(name);
        if(hotel == null) throw new RuntimeException("Hotel not found");
        return hotel;
    }

    public Hotel findByCity(String city) {
        Hotel hotel = hotelRepository.findByCity(city);
        if(hotel == null) throw new RuntimeException("Hotel not found");
        return hotel;
    }

    @Override
    public Page<HotelNoDetail> findAll(Pageable pageable) {
        Page<Hotel> hotelResponses = hotelRepository.findAll(pageable);
        return hotelResponses.map(this::mapNoDetail);
    }

    @Override
    public Hotel update(HotelDTO hotelDTO) {

        Hotel hotel;

        if(hotelDTO.id() != null){
            hotel = this.findById(hotelDTO.id());

            if(hotelDTO.name() != null){
                validation.validate(hotelDTO, "name");
                hotel.setName(hotelDTO.name());
            }
        }else{
            hotel = this.findByName(hotelDTO.name());
        }

        if(hotelDTO.address() != null){
            validation.validate(hotelDTO, "address");
            hotel.setAddress(hotelDTO.address());
        }
        if(hotelDTO.city() != null){
            validation.validate(hotelDTO, "city");
            hotel.setCity(hotelDTO.city());
        }
        if(hotelDTO.country() != null){
            validation.validate(hotelDTO, "country");
            hotel.setCountry(hotelDTO.country());
        }
        if(hotelDTO.postalCode() != null){
            validation.validate(hotelDTO, "postalCode");
            hotel.setPostalCode(hotelDTO.postalCode());
        }
        if(hotelDTO.phone() != null){
            validation.validate(hotelDTO, "phone");
            hotel.setPhone(hotelDTO.phone());
        }
        if(hotelDTO.email() != null){
            validation.validate(hotelDTO, "email");
            hotel.setEmail(hotelDTO.email());
        }
        if(hotelDTO.stars() != null){
            validation.validate(hotelDTO, "stars");
            hotel.setStars(hotelDTO.stars());
        }
        if(hotelDTO.checkInTime() != null){
            validation.validate(hotelDTO, "checkInTime");
            hotel.setCheckInTime(hotelDTO.checkInTime());
        }
        if(hotelDTO.checkOutTime() != null){
            validation.validate(hotelDTO, "checkOutTime");
            hotel.setCheckOutTime(hotelDTO.checkOutTime());
        }
        if(hotelDTO.description() != null){
            validation.validate(hotelDTO, "description");
            hotel.setDescription(hotelDTO.description());
        }

        return hotelRepository.save(hotel);
    }

    @Override
    public void delete(Long id) {
        Hotel hotel = this.findById(id);
        hotelRepository.delete(hotel);
    }

    public HotelResponse map(Hotel hotel) {
        return new HotelResponse(
                hotel.getHotelId(),
                hotel.getName(),
                hotel.getAddress(),
                hotel.getCity(),
                hotel.getCountry(),
                hotel.getPostalCode(),
                hotel.getPhone(),
                hotel.getEmail(),
                hotel.getStars(),
                hotel.getCheckInTime(),
                hotel.getCheckOutTime(),
                hotel.getDescription(),
                roomService.getRoomsNoDetail(hotel.getRooms()),
                hotel.getPromotions().stream().map(
                        promotion -> promotionService.map(promotion)
                ).toList()
        );
    }

    public HotelNoDetail mapNoDetail(Hotel hotel) {
        return new HotelNoDetail(
                hotel.getHotelId(),
                hotel.getName(),
                hotel.getCity(),
                hotel.getCountry(),
                hotel.getPhone(),
                hotel.getEmail(),
                hotel.getStars(),
                hotel.getDescription(),
                roomService.getRoomsNoDetail(hotel.getRooms()),
                hotel.getPromotions().stream().map(
                        promotion -> promotionService.map(promotion)
                ).toList()
        );
    }
}
