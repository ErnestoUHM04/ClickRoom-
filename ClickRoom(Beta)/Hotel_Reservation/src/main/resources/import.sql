-- HOTELS
INSERT INTO hotel (hotel_id, name, email, phone, address, city, country, postal_code, description, stars, check_in_time, check_out_time) VALUES (1, 'Hotel Paraíso', 'info@paraiso.com', '555-1234', 'Av. Principal 123', 'Ciudad Sol', 'México', '12345', 'Un hotel lujoso para escapadas inolvidables.', 5, '14:00:00', '12:00:00');
INSERT INTO hotel (hotel_id, name, email, phone, address, city, country, postal_code, description, stars, check_in_time, check_out_time) VALUES (2, 'Hotel Sol Radiante', 'contacto@solradiante.mx', '555-5678', 'Calle 45 #78', 'Playa Dorada', 'México', '67890', 'Disfruta del sol y la playa en este resort frente al mar.', 4, '15:00:00', '11:00:00');
INSERT INTO hotel (hotel_id, name, email, phone, address, city, country, postal_code, description, stars, check_in_time, check_out_time) VALUES (3, 'Hotel Montaña Azul', 'info@montanaazul.com', '555-9012', 'Carretera s/n', 'Pueblo Alto', 'México', '54321', 'Un refugio tranquilo en la cima de la montaña.', 3, '14:30:00', '12:30:00');

-- ROOM TYPES
INSERT INTO room_type (room_type_id, name, description, max_capacity) VALUES (1, 'Individual', 'Habitación para una persona', 1);
INSERT INTO room_type (room_type_id, name, description, max_capacity) VALUES (2, 'Doble', 'Habitación para dos personas', 2);
INSERT INTO room_type (room_type_id, name, description, max_capacity) VALUES (3, 'Suite', 'Habitación de lujo con sala', 4);
INSERT INTO room_type (room_type_id, name, description, max_capacity) VALUES (4, 'Deluxe', 'Suite de alta gama con vista panorámica', 3);

-- AMENITIES
INSERT INTO amenity (amenity_id, icon, name) VALUES (1, 'wifi', 'Wi-Fi');
INSERT INTO amenity (amenity_id, icon, name) VALUES (2, 'tv', 'Televisión');
INSERT INTO amenity (amenity_id, icon, name) VALUES (3, 'ac', 'Aire Acondicionado');
INSERT INTO amenity (amenity_id, icon, name) VALUES (4, 'minibar', 'Minibar');
INSERT INTO amenity (amenity_id, icon, name) VALUES (5, 'desayuno', 'Desayuno incluido');

-- ROOMS (por hotel)
-- Hotel 1
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (1, 1, 1, 800.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (2, 1, 1, 800.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (3, 1, 1, 800.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (4, 1, 2, 1200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (5, 1, 2, 1200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (6, 1, 2, 1200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (7, 1, 3, 2000.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (8, 1, 3, 2000.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (9, 1, 3, 2000.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (10, 1, 4, 3000.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (11, 1, 4, 3000.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (12, 1, 4, 3000.00);

-- Hotel 2
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (13, 2, 1, 900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (14, 2, 1, 900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (15, 2, 1, 900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (16, 2, 2, 1400.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (17, 2, 2, 1400.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (18, 2, 2, 1400.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (19, 2, 3, 2200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (20, 2, 3, 2200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (21, 2, 3, 2200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (22, 2, 4, 3200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (23, 2, 4, 3200.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (24, 2, 4, 3200.00);

-- Hotel 3
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (25, 3, 1, 700.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (26, 3, 1, 700.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (27, 3, 1, 700.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (28, 3, 2, 1100.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (29, 3, 2, 1100.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (30, 3, 2, 1100.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (31, 3, 3, 1900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (32, 3, 3, 1900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (33, 3, 3, 1900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (34, 3, 4, 2900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (35, 3, 4, 2900.00);
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES (36, 3, 4, 2900.00);

-- ROOM_TYPE_AMENITIES
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (1, 1);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (1, 5);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (2, 1);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (2, 2);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (2, 5);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (3, 1);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (3, 2);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (3, 3);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (3, 4);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (4, 1);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (4, 2);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (4, 3);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (4, 4);
INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES (4, 5);

-- PROMOTIONS
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES (1, 'VERANO2025', 15.00, '2025-06-01', '2025-08-31', 100, 1);
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES (2, 'ESCAPADA10', 10.00, '2025-05-01', '2025-07-15', 50, 1);
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES (3, 'PLAYA20', 20.00, '2025-07-01', '2025-09-30', 80, 2);
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES (4, 'AZUL25', 25.00, '2025-06-15', '2025-09-01', 30, 3);
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES (5, 'TEMPBAJA15', 15.00, '2025-10-01', '2025-12-15', 200, 2);
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES (6, 'FESTIVOS5', 5.00, '2025-12-20', '2026-01-05', 150, 3);
