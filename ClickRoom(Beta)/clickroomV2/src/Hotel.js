import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './img/ClickRoom.png';
import perfilImg from './img/perfil.jpg';

function Hotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  // Estados para tipos de habitación y formulario de reserva
  const [roomTypes, setRoomTypes] = useState([]);
  const [popupReservationForm, setPopupReservationForm] = useState(false);
  const [resRoomTypeId, setResRoomTypeId] = useState('');
  const [resRoomsCount, setResRoomsCount] = useState(1);
  const [resCheckIn, setResCheckIn] = useState('');
  const [resCheckOut, setResCheckOut] = useState('');
  const [resPromoCode, setResPromoCode] = useState('');
  // Estado para abrir/cerrar el popup de pago
    const [popupPagoAbierto, setPopupPagoAbierto] = useState(false);
    // Estado para los datos del formulario de pago
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [cardType, setCardType] = useState('');
    const [cvv, setCvv] = useState('');
  // Estado para la respuesta de reserva
  const [reservationResponse, setReservationResponse] = useState(null);
  // Estado para edición de reserva
  const [editingReservation, setEditingReservation] = useState(null);
  const [popupEditForm, setPopupEditForm] = useState(false);
  // Obtener tipos de habitación del hotel
  useEffect(() => {
    fetch(`/hotel/roomTypes/${id}`)
      .then(res => res.json())
      .then(data => {
        const types = Array.isArray(data)
          ? data
          : Array.isArray(data.content)
            ? data.content
            : [];
        setRoomTypes(types);
      })
      .catch(err => console.error("Error al obtener tipos de habitación", err));
  }, [id]);

  // Estados para filtros
  const [pestanaActiva, setPestanaActiva] = useState(null);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState('');
  // Estados para login y registro
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [popupReservasAbierto, setPopupReservasAbierto] = useState(false);
  const [reservas, setReservas] = useState([]);
  // Estado para sugerencias de ciudades
    const [allCities, setAllCities] = useState([]);
    const [citySuggestions, setCitySuggestions] = useState([]);
    useEffect(() => {
      if (usuario) {
        if (usuario.userRole === 'SUPER') {
          navigate('/admin');
        }
      }
    }, [usuario, navigate]);
    // Cargar todas las ciudades al montar
    useEffect(() => {
      fetch('/hotel/search/all?page=0&size=1000&sort=city')
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data.content)
            ? data.content
            : Array.isArray(data)
              ? data
              : [];
          const cities = [...new Set(list.map(h => h.city))];
          setAllCities(cities);
        })
        .catch(() => setAllCities([]));
    }, []);
  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));
    }
  }, []);
    // Cargar reservas del usuario cuando se abre el popup de reservas
  useEffect(() => {
    if (popupReservasAbierto && usuario) {
      // Fetch reservations for this user
      fetch(`/reservation/search/user/${usuario.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al cargar reservas');
          return res.json();
        })
        .then(data => {
          // For each reservation, fetch hotel name
          return Promise.all(
            data.map(r =>
              fetch(`/hotel/search/${r.hotelId}`)
                .then(res => res.json())
                .then(hotel => ({
                  ...r,
                  hotelName: hotel.name
                }))
            )
          );
        })
        .then(fullReservations => setReservas(fullReservations))
        .catch(err => {
          console.error(err);
          setReservas([]);
        });
    }
  }, [popupReservasAbierto, usuario]);


  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registroData, setRegistroData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetch(`/hotel/search/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("🚀 HOTEL DATA:", data);
        setHotel(data);
      })
      .catch(err => console.error("Error al obtener detalles del hotel", err));
  }, [id]);

  useEffect(() => {
    fetch('/room-type/search/all?page=0&size=10&sort=name')
      .then(res => res.json())
      .then(data => {
        const types = Array.isArray(data)
          ? data
          : Array.isArray(data.content)
            ? data.content
            : [];
        setRoomTypes(types);
      })
      .catch(err => console.error("Error al obtener tipos de habitación", err));
  }, []);

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    setPerfilAbierto(false);
    setReservas([]);
  };
  const handleGlobalSearch = (e) => {
    if (e.key && e.key !== 'Enter') return;

    let params;
    if (!destinoSeleccionado || destinoSeleccionado.trim() === '') {
      // Buscar todos los hoteles
      params = new URLSearchParams({
        todos: true
      });
    } else {
      params = new URLSearchParams({
        destinoSeleccionado: destinoSeleccionado
      });
    }

    navigate(`/resultados?${params.toString()}`);

    if (setPestanaActiva) {
      setPestanaActiva(null);
    }
  };
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de login:", loginData);
    fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login incorrecto");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Usuario logueado:", data);
        setUsuario(data);
        localStorage.setItem("usuario", JSON.stringify(data));
      alert("Datos correctos, bienvenid@ " + data.firstName);
        setPerfilAbierto(false);
        setMostrarLogin(false);
        // Traer reservas
        fetch(`/reservas?userId=${data.userId}`)
          .then((res) => res.json())
          .then((reservas) => {
            console.log("Reservas del usuario:", reservas);
            setReservas(reservas);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error(err);
        alert("Login incorrecto");
      });
  };

  // Nueva función para crear reserva
  const handleReservate = () => {
    // Formatear fechas usando split('T')[0] para obtener YYYY-MM-DD
    const formattedCheckIn = new Date(resCheckIn).toISOString().split('T')[0];
    const formattedCheckOut = new Date(resCheckOut).toISOString().split('T')[0];
    // guestId puede estar en diferentes propiedades
    const guestIdValue = usuario.id ?? usuario.guestId ?? usuario.userId;
    const body = {
      hotelId: parseInt(id, 10),
      roomTypeId: parseInt(resRoomTypeId, 10),
      number: resRoomsCount,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      guestId: guestIdValue,
      code: resPromoCode || null
    };
    console.log('Creating reservation with body:', body);
    fetch('/reservation/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear reserva');
        return res.json();
      })
      .then(data => {
        setReservationResponse(data);
        alert('Reserva creada exitosamente');
        setPopupReservationForm(false);
      })
      .catch(err => {
        console.error('Error al crear reserva', err);
        alert('No se pudo crear la reserva. Intenta de nuevo.');
      });
  };
  const handleRegistroChange = (e) => {
    setRegistroData({ ...registroData, [e.target.name]: e.target.value });
  };
  const handleRegistroSubmit = (e) => {
    e.preventDefault();

    if (registroData.password_hash !== registroData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    fetch("/users/guest/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: registroData.email,
      passwordHash: registroData.password_hash,
      firstName: registroData.first_name,
      lastName: registroData.last_name,
      phone: registroData.phone,
      passportNumber: registroData.passport_number,
      nationality: registroData.nationality,
      birthdate: registroData.birthdate
    }),
  })
      .then((res) => {
        console.log("Status:", res.status);
        return res.json().then(data => {
          console.log("Response data:", data);
          if (!res.ok) {
            throw new Error(data.message || "Error en registro");
          }
          return data;
        });
      })
      .then((data) => {
        console.log("Usuario registrado:", data);
        setUsuario(data);
        setPerfilAbierto(false);
        setMostrarRegistro(false);
        setRegistroData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          birthdate: '',
          nationality: '',
          passport_number: '',
          password_hash: '',
          confirmPassword: ''
        });
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  if (!hotel) return <div className="App">Cargando...</div>;
  // —–– Función de formateo de número de tarjeta —––
  function formatCardNumber(e) {
    let v = e.target.value.replace(/\D/g,'').slice(0,16);
    v = v.match(/.{1,4}/g)?.join('-') || v;
    setCardNumber(v);
  }

  // —–– Función de formateo de expiry —––
  function formatExpiry(e) {
    let v = e.target.value.replace(/\D/g,'').slice(0,4);
    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    setExpiry(v);
  }

  // —–– Manejo de envío del pago —––
  const handlePagoSubmit = e => {
    e.preventDefault();
    fetch('/reservation/update/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservationId: popupPagoAbierto,
        reservationStatus: 'PAGADA'
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al procesar pago');
      return res.json();
    })
    .then(() => {
      alert('Pago exitoso');
      setPopupPagoAbierto(null);
      // refresca tu lista si es necesario
    })
    .catch(err => {
      console.error(err);
      alert('No se pudo procesar el pago.');
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-bar" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="¿A dónde vas?"
            value={destinoSeleccionado}
            onChange={e => {
              const val = e.target.value;
              setDestinoSeleccionado(val);
              if (val.trim()) {
                setCitySuggestions(
                  allCities
                    .filter(c => c.toLowerCase().includes(val.toLowerCase()))
                    .slice(0, 5)
                );
              } else {
                setCitySuggestions([]);
              }
            }}
            onKeyDown={handleGlobalSearch}
          />
          <button
            onClick={handleGlobalSearch}
            className="boton-buscar-popup"
            style={{ marginLeft: '10px' }}
          >
            Hoteles
          </button>
          {citySuggestions.length > 0 && (
            <ul
              className="suggestions-list"
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '200px',
                maxHeight: '150px',
                overflowY: 'auto',
                background: '#fff',
                border: '1px solid #ddd',
                listStyle: 'none',
                margin: 0,
                padding: '5px',
                zIndex: 2000
              }}
            >
              {citySuggestions.map((c, i) => (
                <li
                  key={i}
                  style={{ padding: '6px', cursor: 'pointer' }}
                  onClick={() => {
                    setDestinoSeleccionado(c);
                    setCitySuggestions([]);
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="header-icons">
          <button
            onClick={() => setPopupReservasAbierto(!popupReservasAbierto)}
          >
            <span role="img" aria-label="reservas" style={{ fontSize: 24 }}>
              🛏️
            </span>
          </button>
          <img
            src={perfilImg}
            alt="perfil"
            style={{ cursor: 'pointer', borderRadius: '50%' }}
            onClick={() => {
              setPerfilAbierto(!perfilAbierto);
              setMostrarLogin(false);
              setMostrarRegistro(false);
            }}
          />
        </div>
        {perfilAbierto && (
  <div
    className="pestana-emergente"
    style={{
      position: 'absolute',
      top: '50px',
      right: 0,
      background: '#fff',
      color: '#222',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: '20px',
      zIndex: 2000,
      minWidth: '240px',
      textAlign: 'center'
    }}
  >
    {!mostrarLogin && !mostrarRegistro ? (
      usuario ? (
        <>
          <p style={{
            marginBottom: '16px',
            fontWeight: 'bold',
            color: '#00163a'
          }}>
            Hola, {usuario.firstName}!
          </p>
          <button className='boton'
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <img
            src={perfilImg}
            alt="Perfil"
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              marginBottom: 16,
              objectFit: 'cover'
            }}
          />
          <div style={{ marginBottom: 12 }}>
            <button
              style={{
                width: '100%',
                marginBottom: 8,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #325daf',
                background: '#325daf',
                color: '#fff',
                cursor: 'pointer'
              }}
              onClick={() => {
                setMostrarLogin(true);
                setMostrarRegistro(false);
              }}
            >
              Iniciar sesión
            </button>
            <button
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #325daf',
                background: '#fff',
                color: '#325daf',
                cursor: 'pointer'
              }}
              onClick={() => {
                setMostrarRegistro(true);
                setMostrarLogin(false);
              }}
            >
              Registrarse
            </button>
          </div>
        </>
      )
    ) : mostrarLogin ? (
      <form onSubmit={handleLoginSubmit}>
        <h3 style={{ marginBottom: 16 }}>Iniciar sesión</h3>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={loginData.email}
          onChange={handleLoginChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={loginData.password}
          onChange={handleLoginChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #325daf',
            background: '#325daf',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#fff',
            color: '#325daf',
            cursor: 'pointer'
          }}
          onClick={() => setMostrarLogin(false)}
        >
          Volver
        </button>
      </form>
    ) : (
      
      <form onSubmit={handleRegistroSubmit}>
        <div className='registro-form'>
        <h3 style={{ marginBottom: 16 }}>Registro</h3>

        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={registroData.first_name}
          onChange={handleRegistroChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={registroData.last_name}
          onChange={handleRegistroChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={registroData.email}
          onChange={handleRegistroChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={registroData.phone}
          onChange={handleRegistroChange}
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="date"
          name="birthdate"
          placeholder="Fecha de nacimiento"
          value={registroData.birthdate}
          onChange={handleRegistroChange}
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="text"
          name="nationality"
          placeholder="Nacionalidad"
          value={registroData.nationality}
          onChange={handleRegistroChange}
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="text"
          name="passport_number"
          placeholder="Número de pasaporte"
          value={registroData.passport_number}
          onChange={handleRegistroChange}
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="password_hash"
          name="password_hash"
          placeholder="Contraseña"
          value={registroData.password_hash}
          onChange={handleRegistroChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <input
          type="password_hash"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={registroData.confirmPassword}
          onChange={handleRegistroChange}
          required
          style={{
            width: '90%',
            padding: '8px',
            marginBottom: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #325daf',
            background: '#325daf',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Registrar
        </button>
        <button
          type="button"
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #325daf',
            background: '#fff',
            color: '#325daf',
            cursor: 'pointer'
          }}
          onClick={() => setMostrarRegistro(false)}
        >
          Volver
        </button>
        </div>
      </form>
    )}
  </div>
)}
      {popupReservasAbierto && (
  <div
    className="pestana-emergente"
    style={{
      position: 'absolute',
      top: '50px',
      right: '50px',
      background: '#fff',
      color: '#222',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: '20px',
      zIndex: 2000,
      minWidth: '260px',
      textAlign: 'center'
    }}
  >
    {!usuario ? (
      <>
      <div className='resrvas_IS'>
        <p>No has iniciado sesión. Por favor, inicia sesión para ver tus reservas.</p>
        <button
          style={{
            width: '100%',
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #325daf',
            background: '#325daf',
            color: '#fff',
            cursor: 'pointer'
          }}
          onClick={() => {
            setPopupReservasAbierto(false);
            setPerfilAbierto(true);
            setMostrarLogin(true);
          }}
        >
          Iniciar sesión
        </button>
        <p style={{ fontSize: '0.9em', margin: '10px 0' }}>
          o, si no te has registrado, ¡regístrate!
        </p>
        <button
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #325daf',
            background: '#fff',
            color: '#325daf',
            cursor: 'pointer'
          }}
          onClick={() => {
            setPopupReservasAbierto(false);
            setPerfilAbierto(true);
            setMostrarRegistro(true);
          }}
        >
          Registrarse
        </button>
        </div>
      </>
    ) : (
      <>
        <h3>Mis Reservas</h3>
        {reservas.length === 0 ? (
          <p>No tienes reservaciones.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto', textAlign: 'left' }}>
            {reservas.map((r, i) => (
              <li key={i} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}>
                <p><strong>ID Reserva:</strong> {r.reservationId}</p>
                <p><strong>Hotel:</strong> {r.hotelName}</p>
                <p><strong>Habitaciones:</strong> {r.number}</p>
                <p><strong>Tipo:</strong> {r.roomType}</p>
                <p><strong>Check-In:</strong> {r.checkIn}</p>
                <p><strong>Check-Out:</strong> {r.checkOut}</p>
                <p><strong>Estado:</strong> {r.reservationStatus}</p>
                <p><strong>Precio Final:</strong> ${r.finalPrice}</p>
                <button
                  className='boton'
                  onClick={() => {
                    fetch(`/reservation/delete/${r.reservationId}`, {
                      method: 'DELETE'
                    })
                      .then(res => {
                        if (!res.ok) throw new Error('Error al cancelar reservación');
                        alert('Reservación cancelada');
                        // Reiniciamos la lista de reservas:
                        setReservas(prev => prev.filter(item => item.reservationId !== r.reservationId));
                      })
                      .catch(err => {
                        console.error(err);
                        alert('No se pudo cancelar la reservación.');
                      });
                  }}
                >
                  Cancelar reservación
                </button>
                {r.reservationStatus === 'PENDIENTE' && (
                  <>
                    <button
                      className='boton'
                      style={{ marginLeft: '8px' }}
                      onClick={() => {
                        // Open edit form for this reservation
                        setEditingReservation(r);
                        // Prefill form fields
                        const matchedType = roomTypes.find(rt => rt.name === r.roomType);
                        setResRoomTypeId(matchedType ? matchedType.id.toString() : '');
                        setResRoomsCount(r.number);
                        setResCheckIn(r.checkIn);
                        setResCheckOut(r.checkOut);
                        setResPromoCode(r.newDiscountCode || '');
                        setPopupEditForm(true);
                      }}
                    >
                      Modificar reservación
                    </button>
                    <button
                      className="boton"
                      style={{ marginLeft: '8px' }}
                      onClick={() => setPopupPagoAbierto(r.reservationId)}
                    >
                      Pagar reservación
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      {/* Popup de edición de reserva */}
      {popupEditForm && editingReservation && (
        <div
          className="pestana-emergente"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            background: '#fff',
            color: '#222',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '30px',
            zIndex: 3000,
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <form onSubmit={e => {
            e.preventDefault();
            // Build update body
            const body = {};
            body.reservationId = editingReservation.reservationId;
            if (resCheckIn) body.newCheckIn = new Date(resCheckIn).toISOString().split('T')[0];
            if (resCheckOut) body.newCheckOut = new Date(resCheckOut).toISOString().split('T')[0];
            if (resRoomsCount) body.newRoomCount = resRoomsCount;
            if (resRoomTypeId) body.newRoomTypeId = parseInt(resRoomTypeId, 10);
            if (resPromoCode) body.newDiscountCode = resPromoCode;
            fetch('/reservation/update', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            })
              .then(res => {
                if (!res.ok) throw new Error('Error al modificar reserva');
                alert('Reservación modificada con éxito');
                setPopupEditForm(false);
                // Refresh reservations list by toggling popup
                setPopupReservasAbierto(false);
                setTimeout(() => setPopupReservasAbierto(true), 0);
              })
              .catch(err => {
                console.error(err);
                alert('No se pudo modificar la reservación.');
              });
          }}>
            <h3>Modificar Reservación #{editingReservation.reservationId}</h3>
            <label>Tipo de Habitación:</label>
            <select value={resRoomTypeId} onChange={e => setResRoomTypeId(e.target.value)} required>
              <option value="">Selecciona</option>
              {roomTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
            <br />
            <label>Cantidad de Habitaciones:</label>
            <input type="number" min="1" value={resRoomsCount} onChange={e => setResRoomsCount(parseInt(e.target.value))} required />
            <br />
            <label>Check-In:</label>
            <input type="date" value={resCheckIn} onChange={e => setResCheckIn(e.target.value)} required />
            <br />
            <label>Check-Out:</label>
            <input type="date" value={resCheckOut} onChange={e => setResCheckOut(e.target.value)} required />
            <br />
            <label>Código de Descuento:</label>
            <input type="text" value={resPromoCode} onChange={e => setResPromoCode(e.target.value)} />
            <br />
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="boton-buscar-popup">Guardar Cambios</button>
              <button type="button" onClick={() => setPopupEditForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
      </>
    )}
  </div>
)}
{/* Popup de pago de reservación */}
      {popupPagoAbierto && (
  <div className="pestana-emergente">
    <h3>Pago de reservación #{popupPagoAbierto}</h3>
    <form onSubmit={handlePagoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 1. Número de tarjeta */}
      <label>Número de la tarjeta</label>
      <input
        type="text"
        value={cardNumber}
        onChange={formatCardNumber}  // función que da forma 1234-5678-...
        maxLength={19}
        required
      />
      {/* 2. Fecha de caducidad */}
      <label>Fecha de caducidad</label>
      <input
        type="text"
        placeholder="MM/AA"
        value={expiry}
        onChange={formatExpiry}      // función que inserta la “/”
        maxLength={5}
        required
      />
      {/* 3. Titular */}
      <label>Titular de la tarjeta</label>
      <input
        type="text"
        value={cardHolder}
        onChange={e => setCardHolder(e.target.value)}
        required
      />
      {/* 4. Tipo */}
      <label>Tipo de tarjeta</label>
      <select
        value={cardType}
        onChange={e => setCardType(e.target.value)}
        required
      >
        <option value="">Seleccione</option>
        <option>Visa</option>
        <option>MasterCard</option>
        <option>American Express</option>
      </select>
      {/* 5. CVV */}
      <label>CVV</label>
      <input
        type="password"
        value={cvv}
        onChange={e => {
          const v = e.target.value.replace(/\D/g,'').slice(0,3);
          setCvv(v);
        }}
        maxLength={3}
        required
      />

      <div style={{ marginTop: 20 }}>
        <button type="submit" className="boton-buscar-popup">
          Pagar
        </button>
        <button
          type="button"
          className="boton"
          onClick={() => setPopupPagoAbierto(null)}
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
)}
      </header>

      <main style={{ paddingTop: "60px" }}>

        <div className='H_desc'>

        <h1 style={{ textAlign: 'center' }}>{hotel.name}</h1>
      <p style={{ textAlign: 'center' }}>Estrellas: {hotel.stars}</p>
      <p style={{ textAlign: 'center' }}>Ciudad: {hotel.city}, {hotel.country}</p>
      <p style={{ textAlign: 'center' }}>Descripción: {hotel.description}</p>
      <p style={{ textAlign: 'center' }}>Teléfono: {hotel.phone}</p>
      <p style={{ textAlign: 'center' }}>Email: {hotel.email}</p>

      <h2>Tipos de habitación</h2>
      <ul>
        {roomTypes.map((type, i) => (
          <li key={i}>
            <strong>{type.name}</strong>: {type.description}<br />
            Capacidad Máx: {type.maxCapacity}<br />
            Amenidades:
            <ul>
              {type.amenityCreates?.map((amenity, j) => (
                <li key={j}>{amenity.name} {amenity.icon && <span>{amenity.icon}</span>}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Promociones</h2>
      <ul>
        {hotel.promotionDTOS?.map((promo, i) => (
          <li key={i}>
            <strong>{promo.code}</strong> - {promo.discountPercent}% de descuento<br />
            Vigencia: {promo.startDate} - {promo.endDate}
          </li>
        ))}
      </ul>
</div>
      {/* Botón Reservar */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          className="boton-buscar-popup"
          onClick={() => setPopupReservationForm(true)}
        >
          Reservar
        </button>
      </div>

      </main>

      {/* Popup de Reserva */}
      {popupReservationForm && (
        <div
          className="pestana-emergente"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            color: '#222',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '30px',
            zIndex: 3000,
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <div className='reserva'>
          {!usuario ? (
            <>
              <p>No has iniciado sesión. Por favor, inicia sesión para hacer una reserva.</p>
              <button onClick={() => { setPopupReservationForm(false); setMostrarLogin(true); setPerfilAbierto(true); }}>
                Iniciar sesión
              </button>
            </>
          ) : (
            <>
              <form onSubmit={e => {
                e.preventDefault();
                handleReservate();
              }}>
               
                <h3>Hacer Reservación</h3>
                
                <label>Tipo de Habitación:</label>
                <select value={resRoomTypeId} onChange={e => setResRoomTypeId(e.target.value)} required>
                  <option value="">Selecciona</option>
                  {roomTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>{rt.name}</option>
                  ))}
                </select>
                <br />
                <label>Cantidad de Habitaciones:</label>
                <input type="number" min="1" value={resRoomsCount} onChange={e => setResRoomsCount(parseInt(e.target.value))} required />
                <br />
                <label>Check-In:</label>
                <input type="date" value={resCheckIn} onChange={e => setResCheckIn(e.target.value)} required />
                <br />
                <label>Check-Out:</label>
                <input type="date" value={resCheckOut} onChange={e => setResCheckOut(e.target.value)} required />
                <br />
                <label>Código de Promoción (opcional):</label>
                <input type="text" value={resPromoCode} onChange={e => setResPromoCode(e.target.value)} />
                <br />
                <div style={{ marginTop: '20px' }}>
                  <button type="submit" className="boton-buscar-popup">Confirmar Reserva</button>
                  <button type="button" onClick={() => setPopupReservationForm(false)}>Cancelar</button>
                </div>
              </form>
              {reservationResponse && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <h4>Respuesta del Servidor:</h4>
                  <pre style={{ background: '#f9f9f9', padding: '10px', borderRadius: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                    {JSON.stringify(reservationResponse, null, 2)}
                  </pre>
                </div>
              )}
            
            </>
          )}
          </div>
        </div>
      )}

      <footer style={{ background: '#00163a', color: '#fff', padding: '20px', textAlign: 'center', marginTop: '30px' }}>
        <p><a href='/terycon'>Términos y Condiciones de Uso</a></p>
        <p><a href='/avPriv'>Aviso de privacidad</a></p>
        <p><a href='/avLeg'>Avisos legales</a></p>
        <p><b>©2025 ClickRoom. Todos los derechos reservados.</b></p>
        <p>Desarrollado por <b>Siminbikini</b></p>
      </footer>
    </div>
  );
}

export default Hotel;