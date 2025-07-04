
-- HOTELS (5 nuevos) del 4 al 8
INSERT INTO hotel (hotel_id, name, email, phone, address, city, country, postal_code, description, stars, check_in_time, check_out_time)
VALUES 
(4, 'Hotel Costa Serena', 'info@costaserena.com', '555-2345', 'Av. Marina 45', 'Puerto Azul', 'México', '24680', 'Vistas al mar y brisa constante.', 4, '15:00:00', '12:00:00'),
(5, 'Hotel Valle Verde', 'contacto@valleverde.mx', '555-6789', 'Camino del Valle 10', 'Valle Encantado', 'México', '13579', 'Naturaleza y paz en cada rincón.', 3, '14:00:00', '11:00:00'),
(6, 'Hotel Urbano Chic', 'reservas@urbanochic.com', '555-1122', 'Calle Moderna 99', 'Ciudad Capital', 'México', '11223', 'Diseño vanguardista en el corazón urbano.', 5, '16:00:00', '12:00:00'),
(7, 'Hotel Lago Escondido', 'info@lagoescondido.mx', '555-3344', 'Carretera Lago 5', 'Lago Alegre', 'México', '44556', 'Refugio junto al lago.', 4, '15:30:00', '12:30:00'),
(8, 'Hotel Sierra Dorada', 'contacto@sierradorada.com', '555-5566', 'Km 12 Carretera Sierra', 'Sierra Alta', 'México', '66778', 'Montaña y lujo combinados.', 5, '14:30:00', '11:30:00');

-- ROOMS (8 por hotel, 2 de cada tipo)
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES
-- Hotel 4: Costa Serena
(37, 4, 1, 850.00),(38, 4, 1, 850.00),
(39, 4, 2, 1300.00),(40, 4, 2, 1300.00),
(41, 4, 3, 2100.00),(42, 4, 3, 2100.00),
(43, 4, 4, 3100.00),(44, 4, 4, 3100.00),
-- Hotel 5: Valle Verde
(45, 5, 1, 780.00),(46, 5, 1, 780.00),
(47, 5, 2, 1180.00),(48, 5, 2, 1180.00),
(49, 5, 3, 2050.00),(50, 5, 3, 2050.00),
(51, 5, 4, 2950.00),(52, 5, 4, 2950.00),
-- Hotel 6: Urbano Chic
(53, 6, 1, 950.00),(54, 6, 1, 950.00),
(55, 6, 2, 1450.00),(56, 6, 2, 1450.00),
(57, 6, 3, 2300.00),(58, 6, 3, 2300.00),
(59, 6, 4, 3400.00),(60, 6, 4, 3400.00),
-- Hotel 7: Lago Escondido
(61, 7, 1, 820.00),(62, 7, 1, 820.00),
(63, 7, 2, 1230.00),(64, 7, 2, 1230.00),
(65, 7, 3, 2150.00),(66, 7, 3, 2150.00),
(67, 7, 4, 3250.00),(68, 7, 4, 3250.00),
-- Hotel 8: Sierra Dorada
(69, 8, 1, 980.00),(70, 8, 1, 980.00),
(71, 8, 2, 1500.00),(72, 8, 2, 1500.00),
(73, 8, 3, 2400.00),(74, 8, 3, 2400.00),
(75, 8, 4, 3600.00),(76, 8, 4, 3600.00);

-- PROMOTIONS (1 por hotel nuevo)
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES
(7, 'COSTA10', 10.00, '2025-07-01', '2025-09-30', 100, 4),
(8, 'VERDE15', 15.00, '2025-08-01', '2025-10-31', 80, 5),
(9, 'URBANO20', 20.00, '2025-06-15', '2025-12-15', 50, 6),
(10, 'LAGO5', 5.00, '2025-07-10', '2025-08-10', 120, 7),
(11, 'SIERRA25', 25.00, '2025-09-01', '2025-11-30', 60, 8);

-- HOTELS (5 nuevos)
INSERT INTO hotel (hotel_id, name, email, phone, address, city, country, postal_code, description, stars, check_in_time, check_out_time)
VALUES
(9,  'Hotel Oasis del Desierto',   'info@oasissol.com',      '555-7788', 'Calle del Desierto 1',     'Dunas Secas',      'México', '88990', 'Refugio en el árido paisaje.',          3, '14:00:00', '12:00:00'),
(10, 'Hotel Bosque Encantado',      'reservas@bosqueenc.mx',  '555-8899', 'Camino del Bosque 22',      'Verde Alto',       'México', '99221', 'Magia y naturaleza en armonía.',         4, '15:00:00', '11:00:00'),
(11, 'Hotel Río Sereno',            'contacto@riosereno.com', '555-9900', 'Av. Río Claro 5',          'Corriente Azul',   'México', '33445', 'Tranquilidad junto al río cristalino.',  4, '15:30:00', '12:30:00'),
(12, 'Hotel Plaza Colonial',        'info@plazacolonial.mx',  '555-1011', 'Plaza Mayor 10',           'Ciudad Antigua',   'México', '55667', 'Encanto histórico en el centro.',        5, '16:00:00', '12:00:00'),
(13, 'Hotel Marqués del Viento',    'reservas@marquesviento.com','555-1213','Paseo del Marqués 3',     'Viento Claro',     'México', '77889', 'Elegancia y aire fresco.',               5, '14:30:00', '11:30:00');

-- ROOMS (8 por hotel, 2 de cada tipo)
INSERT INTO room (room_id, hotel_id, room_type_id, base_price) VALUES
-- Hotel 9: Oasis del Desierto
(77,  9, 1,  800.00),(78,  9, 1,  800.00),
(79,  9, 2, 1300.00),(80,  9, 2, 1300.00),
(81,  9, 3, 2100.00),(82,  9, 3, 2100.00),
(83,  9, 4, 3100.00),(84,  9, 4, 3100.00),
-- Hotel 10: Bosque Encantado
(85, 10, 1,  900.00),(86, 10, 1,  900.00),
(87, 10, 2, 1400.00),(88, 10, 2, 1400.00),
(89, 10, 3, 2200.00),(90, 10, 3, 2200.00),
(91, 10, 4, 3200.00),(92, 10, 4, 3200.00),
-- Hotel 11: Río Sereno
(93, 11, 1,  850.00),(94, 11, 1,  850.00),
(95, 11, 2, 1350.00),(96, 11, 2, 1350.00),
(97, 11, 3, 2150.00),(98, 11, 3, 2150.00),
(99, 11, 4, 3150.00),(100,11, 4, 3150.00),
-- Hotel 12: Plaza Colonial
(101,12, 1, 1000.00),(102,12, 1, 1000.00),
(103,12, 2, 1500.00),(104,12, 2, 1500.00),
(105,12, 3, 2400.00),(106,12, 3, 2400.00),
(107,12, 4, 3500.00),(108,12, 4, 3500.00),
-- Hotel 13: Marqués del Viento
(109,13, 1,  950.00),(110,13, 1,  950.00),
(111,13, 2, 1450.00),(112,13, 2, 1450.00),
(113,13, 3, 2350.00),(114,13, 3, 2350.00),
(115,13, 4, 3450.00),(116,13, 4, 3450.00);

-- PROMOTIONS (1 por cada hotel nuevo)
INSERT INTO promotion (promotion_id, code, discount_percent, start_date, end_date, max_uses, hotel_id) VALUES
(12, 'OASIS10',    10.00, '2025-08-01', '2025-10-31', 100,  9),
(13, 'BOSQUE15',   15.00, '2025-09-01', '2025-11-30',  80, 10),
(14, 'RIOSER20',   20.00, '2025-07-15', '2025-09-15',  60, 11),
(15, 'COLONIAL5',   5.00, '2025-10-01', '2025-12-15', 120, 12),
(16, 'MARQUES25',  25.00, '2025-11-01', '2026-01-31',  50, 13);

INSERT INTO user (role, user_id, blocked, email, first_name, last_name, password_hash, phone, birthdate, nationality, passport_number) VALUES
('ADMIN', 2, 0, 'admin@gmail.com', 'Admin', 'User', 'password', '555-0001', '1990-01-01', 'Mexican', 'P12345678');