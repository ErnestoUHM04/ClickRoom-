package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.room.RoomTypeDTO;
import TDAW.Hotel_Reservation.entity.room.Amenity;
import TDAW.Hotel_Reservation.entity.room.RoomType;
import TDAW.Hotel_Reservation.repository.RoomTypeRepository;
import TDAW.Hotel_Reservation.service.Validation;
import TDAW.Hotel_Reservation.service.interfaces.IRoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@Transactional
public class RoomTypeService implements IRoomTypeService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private AmenityService amenityService;

    @Autowired
    private Validation validation;

    @Override
    public RoomType create(RoomTypeDTO roomTypeDTO) {

        RoomType roomType = new RoomType(
                null,
                roomTypeDTO.name(),
                roomTypeDTO.description(),
                roomTypeDTO.maxCapacity(),
                new ArrayList<>()
        );

        RoomType savedRoomType = roomTypeRepository.save(roomType);

        List<Amenity> amenities = roomTypeDTO.amenityCreates().stream()
                .map(amenityDTO -> {
                    Amenity amenity = null;
                    if(amenityDTO.id() != null){
                        amenity = amenityService.findById(amenityDTO.id());
                    }else{
                        amenity = amenityService.findByNameNoException(amenityDTO.name());

                        if(amenity == null) {
                            validation.validate(amenityDTO, "all");
                            amenity = new Amenity(
                                    null,
                                    amenityDTO.name(),
                                    amenityDTO.icon(),
                                    new ArrayList<>()
                            );
                            amenity.getRoomTypes().add(roomType);

                            amenityService.save(amenity);
                        }
                    }
                    return amenity;
                }).toList();

        savedRoomType.setAmenities(new ArrayList<>(amenities));

        return savedRoomType;
    }

    @Override
    public RoomType findById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RoomType not found"));
    }

    @Override
    public RoomType findByName(String name) {
        RoomType roomType = roomTypeRepository.findByName(name);
        if(roomType == null) throw new RuntimeException("RoomType not found");
        return roomType;
    }

    public RoomType findByNameNoException(String name){
        return roomTypeRepository.findByName(name);
    }

    @Override
    public Page<RoomTypeDTO> findAll(Pageable pageable) {
        Page<RoomType> roomTypes = roomTypeRepository.findAll(pageable);
        return roomTypes.map(this::map);
    }

    @Override
    public RoomType update(RoomTypeDTO roomTypeDTO) {
        RoomType roomType;

        if(roomTypeDTO.id() != null){
            roomType = this.findById(roomTypeDTO.id());
            if(roomType.getName() != null){
                validation.validate(roomTypeDTO,"name");
                roomType.setName(roomType.getName());
            }
        }else roomType = this.findByName(roomTypeDTO.name());

        if(roomTypeDTO.description() != null) {
            validation.validate(roomTypeDTO,"description");
            roomType.setDescription(roomTypeDTO.description());
        }

        if(roomTypeDTO.maxCapacity() != null) {
            validation.validate(roomTypeDTO,"maxCapacity");
            roomType.setMaxCapacity(roomTypeDTO.maxCapacity());
        }

        if(roomTypeDTO.amenityCreates() != null)
            if(!roomTypeDTO.amenityCreates().isEmpty()){
                List<Amenity> amenities = roomTypeDTO.amenityCreates().stream()
                        .map(amenityDTO -> {
                            Amenity amenity;
                            if(amenityDTO.id() != null){
                                amenity = amenityService.findById(amenityDTO.id());
                            }else{
                                amenity = amenityService.findByNameNoException(amenityDTO.name());

                                if(amenity == null) {
                                    validation.validate(amenityDTO, "all");
                                    amenity = new Amenity(
                                            null,
                                            amenityDTO.name(),
                                            amenityDTO.icon(),
                                            new ArrayList<>((Collection) roomType)
                                    );
                                }
                            }
                            return amenity;
                        }).toList();

                roomType.getAmenities().forEach(
                        amenity -> {
                            if(!amenities.contains(amenity)){
                                amenity.getRoomTypes().remove(roomType);
                                if(amenity.getRoomTypes().isEmpty()){
                                    amenityService.delete(amenity.getAmenityId());
                                }
                            }
                        }
                );

                roomType.setAmenities(new ArrayList<>(amenities));
            }

        return roomTypeRepository.save(roomType);
    }

    @Override
    public void delete(Long id) {
        RoomType roomType = this.findById(id);

        roomType.getAmenities().forEach(
                amenity -> {
                    amenity.getRoomTypes().remove(roomType);
                    if(amenity.getRoomTypes().isEmpty()){
                        amenityService.delete(amenity.getAmenityId());
                    }
                }
        );

        roomType.getAmenities().clear();

        roomTypeRepository.delete(roomType);
    }

    public RoomTypeDTO map(RoomType roomType) {
        return new RoomTypeDTO(
                roomType.getRoomTypeId(),
                roomType.getName(),
                roomType.getDescription(),
                roomType.getMaxCapacity(),
                roomType.getAmenities().stream().map(
                        amenity -> amenityService.map(amenity)
                ).toList()
        );
    }
}
