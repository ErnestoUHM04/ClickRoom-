package TDAW.Hotel_Reservation.service;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class Validation {

    @Autowired
    private Validator validator;

    public void validate(Object object, String atributo){
        Set<ConstraintViolation<Object>> violations;

        if(atributo.equals("all")) violations = validator.validate(object);
        else violations = validator.validateProperty(object, atributo);

        if (!violations.isEmpty())
            throw new IllegalArgumentException("Validation failed for AmenityDTO");
    }
}
