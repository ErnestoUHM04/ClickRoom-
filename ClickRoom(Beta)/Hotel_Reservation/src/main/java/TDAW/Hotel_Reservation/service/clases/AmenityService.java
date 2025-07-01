package TDAW.Hotel_Reservation.service.clases;

import TDAW.Hotel_Reservation.dto.room.AmenityDTO;
import TDAW.Hotel_Reservation.entity.room.Amenity;
import TDAW.Hotel_Reservation.repository.AmenityRepository;
import TDAW.Hotel_Reservation.service.Validation;
import TDAW.Hotel_Reservation.service.interfaces.IAmenityService;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
public class AmenityService implements IAmenityService {

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private Validation validation;

    @Autowired
    private Validator validator;

    @Override
    public Amenity create(AmenityDTO amenityDTO) {
        Amenity amenity =
                new Amenity(null, amenityDTO.name(), amenityDTO.icon(), new ArrayList<>());
        return amenityRepository.save(amenity);
    }

    public Amenity save(Amenity amenity) {
        return amenityRepository.save(amenity);
    }

    @Override
    public Amenity findById(Long id) {
        return amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));
    }

    @Override
    public Amenity findByName(String name) {
        Amenity amenity = amenityRepository.findByName(name);
        if(amenity == null) throw new RuntimeException("Amenity not found");
        return amenity;
    }

    @Override
    public Page<AmenityDTO> findAll(Pageable pageable) {
        Page<Amenity> amenities = amenityRepository.findAll(pageable);
        return amenities.map(this::map);
    }

    @Override
    public Amenity update(AmenityDTO amenityDTO) {
        Amenity amenity;
        if(amenityDTO.id() != null){
            amenity = this.findById(amenityDTO.id());
            if(amenityDTO.name() != null) {
                validation.validate(amenityDTO,"name");
                amenity.setName(amenityDTO.name());
            }
        }else{
            amenity = this.findByName(amenityDTO.name());
        }
        if(amenityDTO.icon() != null){
            validation.validate(amenityDTO,"icon");
            amenity.setIcon(amenityDTO.icon());
        }

        return amenityRepository.save(amenity);
    }

    @Override
    public void delete(Long id) {
        Amenity amenity = this.findById(id);
        amenityRepository.delete(amenity);
    }

    public Amenity findByNameNoException(String name) {
        return amenityRepository.findByName(name);
    }

    public AmenityDTO map(Amenity amenity){
        return new AmenityDTO(
                amenity.getAmenityId(),
                amenity.getName(),
                amenity.getIcon()
        );
    }
}
