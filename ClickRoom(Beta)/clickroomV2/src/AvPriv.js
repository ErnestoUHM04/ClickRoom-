import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import './App.css';
import logo from './img/ClickRoom.png';
import perfilImg from './img/perfil.jpg';

function AvPriv() {
  const navigate = useNavigate();

  // Estados para pestañas/filtros
  const [pestanaActiva, setPestanaActiva] = useState(null);

  // Estados para login y registro
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [popupReservasAbierto, setPopupReservasAbierto] = useState(false);
  const [reservas, setReservas] = useState([]);
  // Estado para edición de reserva
  const [editingReservation, setEditingReservation] = useState(null);
  const [popupEditForm, setPopupEditForm] = useState(false);
  // Estados para el formulario de edición de reserva
  const [roomTypes, setRoomTypes] = useState([]);
  const [resRoomTypeId, setResRoomTypeId] = useState('');
  const [resRoomsCount, setResRoomsCount] = useState(1);
  const [resCheckIn, setResCheckIn] = useState('');
  const [resCheckOut, setResCheckOut] = useState('');
  const [resPromoCode, setResPromoCode] = useState('');
  // Cargar tipos de habitación al montar (manejar respuesta paginada)
  useEffect(() => {
    fetch('/room-type/search/all?page=0&size=10&sort=name')
      .then(res => res.json())
      .then(data => {
        const types = Array.isArray(data.content) ? data.content : [];
        setRoomTypes(types);
      })
      .catch(() => setRoomTypes([]));
  }, []);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registroData, setRegistroData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birthdate: '',
    passport_number: '',
    nationality: '',
    password_hash: '',
    confirmPassword: ''
  });

  // Estados para filtros
  const [destinoSeleccionado, setDestinoSeleccionado] = useState('');
  const [llegada, setLlegada] = useState('');
  const [salida, setSalida] = useState('');
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [habitaciones, setHabitaciones] = useState(1);
  // Estado para sugerencias de ciudades
  const [allCities, setAllCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
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

const handleBuscar = () => {
  if (!destinoSeleccionado) {
    alert("Por favor selecciona un destino.");
    return;
  }
  if (llegada && salida && new Date(salida) <= new Date(llegada)) {
    alert("La fecha de salida debe ser posterior a la de llegada.");
    return;
  }
  const params = new URLSearchParams({
    destino: destinoSeleccionado,
    llegada,
    salida,
    adultos,
    ninos,
    habitaciones
  });
  navigate(`/resultados?${params.toString()}`);

  // Cerrar todas las pestañas emergentes
  setPestanaActiva(null);
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
        destino: destinoSeleccionado
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
  
  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    setPerfilAbierto(false);
    setReservas([]);
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

  return (
    <div className="App">
      <header className="App-header">
        {/* Logo */}
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
              if (val.trim() !== '') {
                const sug = allCities
                  .filter(c => c && c.toLowerCase().includes(val.toLowerCase()))
                  .slice(0, 5);
                setCitySuggestions(sug);
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
            <ul className="suggestions-list" style={{
              listStyle: 'none',
              margin: 0,
              padding: '5px',
              background: '#fff',
              color: '#000',
              position: 'absolute',
              width: '200px',
              zIndex: 2000,
              top: '40px',
              right: 0,
              marginRight: '200px',
              border: '1px solid #eee',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              {citySuggestions.map((city, i) => (
                <li
                  key={i}
                  style={{ padding: '5px', cursor: 'pointer' }}
                  onClick={() => {
                    setDestinoSeleccionado(city);
                    setCitySuggestions([]);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Iconos del header */}
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
                border: '1px solid #f9c300',
                background: '#f9c300',
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
                border: '1px solid #f9c300',
                background: '#fff',
                color: '#f9c300',
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
            border: '1px solid #f9c300',
            background: '#f9c300',
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
            color: '#f9c300',
            cursor: 'pointer'
          }}
          onClick={() => setMostrarLogin(false)}
        >
          Volver
        </button>
      </form>
    ) : (
      <form onSubmit={handleRegistroSubmit}>
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
            border: '1px solid #f9c300',
            background: '#f9c300',
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
            border: '1px solid #ccc',
            background: '#fff',
            color: '#f9c300',
            cursor: 'pointer'
          }}
          onClick={() => setMostrarRegistro(false)}
        >
          Volver
        </button>
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
        <p>No has iniciado sesión. Por favor, inicia sesión para ver tus reservas.</p>
        <button
          style={{
            width: '100%',
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #f9c300',
            background: '#f9c300',
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
            border: '1px solid #f9c300',
            background: '#fff',
            color: '#f9c300',
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
              </li>
            ))}
          </ul>
        )}
      </>
    )}
  </div>
)}

      {/* Popup para editar reservación */}
      {popupEditForm && editingReservation && (
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
          <form onSubmit={e => {
            e.preventDefault();
            const body = { reservationId: editingReservation.reservationId };
            if (resCheckIn) body.newCheckIn = new Date(resCheckIn).toISOString().split('T')[0];
            if (resCheckOut) body.newCheckOut = new Date(resCheckOut).toISOString().split('T')[0];
            if (resRoomsCount) body.newRoomCount = resRoomsCount;
            if (resRoomTypeId) body.newRoomTypeId = parseInt(resRoomTypeId, 10);
            if (resPromoCode) body.newDiscountCode = resPromoCode;
            fetch(`/reservation/update`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            })
              .then(res => {
                if (!res.ok) throw new Error('Error al modificar reserva');
                alert('Reservación modificada con éxito');
                setPopupEditForm(false);
                // refresh reservations by toggling popup
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
            </select><br/>
            <label>Cantidad de Habitaciones:</label>
            <input type="number" min="1" value={resRoomsCount} onChange={e => setResRoomsCount(parseInt(e.target.value, 10))} required /><br/>
            <label>Check-In:</label>
            <input type="date" value={resCheckIn} onChange={e => setResCheckIn(e.target.value)} required /><br/>
            <label>Check-Out:</label>
            <input type="date" value={resCheckOut} onChange={e => setResCheckOut(e.target.value)} required /><br/>
            <label>Código de Descuento:</label>
            <input type="text" value={resPromoCode} onChange={e => setResPromoCode(e.target.value)} /><br/>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="boton-buscar-popup">Guardar Cambios</button>
              <button type="button" onClick={() => setPopupEditForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
      </header>

      <main style={{ paddingTop: "60px" }}>
        <div style={{textAlign:'justify', marginTop: '20px', padding: '0 20px'}}>
            <h1 style={{textAlign:'center'}}>Aviso de privacidad</h1>
            <p><strong>Última actualización:</strong> <b>julio</b> de 2025</p>

            <p>Este Aviso de privacidad es válido para todos los sitios web, aplicaciones y demás servicios y ofertas (colectivamente, “los Servicios”) operados por <strong>ClickRoom S.A. de C.V.</strong> y sus subsidiarias (“nosotros”, “nos” o “ClickRoom”).</p>

            <p>En este Aviso de privacidad, se brinda información sobre el procesamiento de los datos personales por parte de ClickRoom con relación a tu uso de los Servicios. Los datos personales son cualquier dato que se puede usar para identificarte, ya sea de forma directa o indirecta.</p>

            <p>Como metabuscador, ClickRoom puede redirigirte a sitios web o aplicaciones de terceros. Ten en cuenta que no controlamos estos servicios de terceros y que el uso que hagas de ellos está sujeto a las políticas de privacidad publicadas en los sitios web o las aplicaciones correspondientes, y no a este Aviso de privacidad.</p>

            <p>Debido al desarrollo tecnológico continuo, los cambios en nuestros servicios y en las leyes, entre otras cosas, es necesario hacer ajustes en nuestro Aviso de privacidad. Haremos cambios a este Aviso de privacidad con regularidad, por lo que te pedimos mantenerte actualizado de su contenido.</p>

            <ol>
                <li>
                <h2>Responsable del procesamiento de los datos personales</h2>
                <p><strong>ClickRoom S.A. de C.V.</strong> controla las operaciones de procesamiento que se describen en este Aviso de privacidad. Somos una empresa constituida conforme a las leyes de los Países Bajos y tenemos nuestras oficinas en Kesselstraße 5-7, 40221 Düsseldorf, Alemania.</p>
                <p>Para ejercer tus derechos de protección de datos, o para hacer una pregunta general sobre el procesamiento de tus datos personales por parte de ClickRoom o sobre este Aviso de privacidad, puedes comunicarte con nuestro equipo por correo electrónico a <a href="mailto:privacy@clickroom.com" style={{color:'black'}}>privacy@clickroom.com</a>.</p>
                <p>Para comunicarte directamente con nuestro agente de protección de datos, envía un correo electrónico a <a href="mailto:privacy@clickroom.com" style={{color:'black'}}>privacy@clickroom.com</a> con el asunto “Para el agente de protección de datos”. Ten en cuenta que los correos electrónicos enviados a esta dirección no serán automáticamente confidenciales ni los leerá únicamente el agente de protección de datos. Si necesitas una comunicación confidencial, indícalo en tu correo electrónico y nosotros nos encargaremos de ello.</p>
                </li>

                <li>
                <h2>Tus derechos</h2>
                <p>En lo que respecta a los datos personales, tus derechos son los siguientes (consulta la sección 1 para más detalles de contacto):</p>
                <ol type="a">
                    <li><strong>Derechos generales:</strong> información (Art. 13 RGPD), acceso (Art. 15), supresión (Art. 17), rectificación (Art. 16), limitación del tratamiento (Art. 18) y portabilidad de datos (Art. 20).</li>
                    <li><strong>Derecho a revocar el consentimiento:</strong> puedes retirar tu consentimiento en cualquier momento; no afectará la licitud del procesamiento previo.</li>
                    <li><strong>Oposición al procesamiento por intereses legítimos:</strong> tienes derecho a oponerte al tratamiento basado en intereses legítimos; en caso afirmativo, dejaremos de procesar tus datos salvo excepciones legales.</li>
                    <li><strong>Oposición al marketing directo:</strong> puedes oponerte al tratamiento de tus datos para marketing directo en cualquier momento (consulta sección 6.1).</li>
                    <li><strong>Queja ante autoridad supervisora:</strong> puedes presentar una denuncia ante cualquier autoridad de protección de datos de la UE; la autoridad competente de ClickRoom es Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestr. 2-4, 40213 Düsseldorf, teléfono: 0211/38424-0, correo: <a href="mailto:poststelle@ldi.nrw.de" style={{color:'black'}}>poststelle@ldi.nrw.de</a>.</li>
                </ol>
                </li>

                <li>
                <h2>Qué datos recopilamos de ti</h2>
                <p>Cuando usas nuestros Servicios, podemos procesar los siguientes tipos de datos personales:</p>
                <ul>
                    <li><strong>Datos de usuario:</strong> nombre, email, contraseña, dirección postal, edad, género, perfiles en redes sociales, opiniones, etc.</li>
                    <li><strong>Datos de uso:</strong> información sobre búsquedas realizadas (destino, fechas, número de invitados, moneda, etc.), ofertas vistas y clics.</li>
                    <li><strong>Interacción con marketing:</strong> análisis de aperturas de boletines y clics en enlaces.</li>
                    <li><strong>Datos de reservación:</strong> información enviada por los sitios de reservación donde completes una reserva.</li>
                    <li><strong>Datos de ubicación:</strong> ubicación aproximada por IP o GPS (con consentimiento).</li>
                    <li><strong>Datos bancarios:</strong> solo si compartes información para pagos o reembolsos en ClickRoom Business Studio.</li>
                    <li><strong>Datos técnicos:</strong> IP, cookies, ID de sesión, estado HTTP, software, SO, navegador, etc.</li>
                </ul>
                </li>

                <li>
                <h2>Por qué y cómo usamos tus datos personales</h2>
                <p>Usamos tus datos para:</p>
                <ol type="a">
                    <li>Prestar nuestros Servicios y comparar ofertas de hospedaje.<br></br>
                        <strong>Fundamento:</strong> contrato, consentimiento.<br></br>
                        <strong>Datos:</strong> usuario, uso, reservación, ubicación, técnicos.</li>
                    <li>Mantener un entorno seguro y confiable.<br></br>
                        <strong>Fundamento:</strong> obligación legal, interés legítimo.<br></br>
                        <strong>Datos:</strong> uso, técnicos.</li>
                    <li>Mejorar nuestros Servicios según tu uso.<br></br>
                        <strong>Fundamento:</strong> consentimiento, interés legítimo.<br></br>
                        <strong>Datos:</strong> usuario, uso, reservación, técnicos.</li>
                    <li>Enviarte marketing directo y administrar promociones.<br></br>
                        <strong>Fundamento:</strong> consentimiento, interés legítimo.<br></br>
                        <strong>Datos:</strong> usuario, uso, técnicos.</li>
                    <li>Comunicarte y ofrecer atención al cliente.<br></br>
                        <strong>Fundamento:</strong> contrato, interés legítimo.<br></br>
                        <strong>Datos:</strong> usuario, uso, reservación, bancarios.</li>
                    <li>Cumplir obligaciones con terceros (sitios de reservación).<br></br>
                        <strong>Fundamento:</strong> contrato, interés legítimo.<br></br>
                        <strong>Datos:</strong> usuario, uso, reservación.</li>
                    <li>Cumplir con leyes, prevención de fraude y acciones legales.<br></br>
                        <strong>Fundamento:</strong> obligación legal, interés legítimo.<br></br>
                        <strong>Datos:</strong> usuario, uso, reservación, técnicos.</li>
                </ol>
                </li>

                <li>
                <h2>Con quién compartimos tus datos</h2>
                <p>Podemos compartirlos con:</p>
                <ul>
                    <li>Subsidiarias de ClickRoom.</li>
                    <li>Socios de autenticación (p. ej. Facebook, Google, Apple).</li>
                    <li>Proveedores externos de procesamiento de datos.</li>
                    <li>Socios que ofrecen servicios conjuntos.</li>
                    <li>Proveedores de viajes externos (hoteles, aerolíneas, seguros, etc.).</li>
                    <li>Autoridades policiales y judiciales.</li>
                    <li>En transacciones corporativas (fusiones, ventas de activos, etc.).</li>
                </ul>
                <p>Todos nuestros proveedores están obligados contractualmente a seguir nuestras instrucciones y proteger tus datos.</p>
                </li>

                <li>
                <h2>Información específica de los servicios</h2>
                <h3>6.1 Boletín informativo</h3>
                <p>Al suscribirte, recibirás un correo de confirmación. Si no confirmas en 24 h, tus datos se eliminan en un mes. Puedes cancelar la suscripción en cualquier momento mediante el enlace “Cancelar suscripción” en el pie de los boletines o contactándonos.</p>

                <h3>6.2 Cuenta de usuario de ClickRoom</h3>
                <p>Crear una cuenta es voluntario, pero puede ser necesario para ciertas funciones. Puedes modificar o eliminar tu cuenta; tras un periodo de inactividad se eliminará automáticamente.</p>

                <h3>6.3 Business Studio</h3>
                <p>Los hoteleros pueden registrarse en ClickRoom Business Studio para gestionar su perfil y acceder a productos pagados. Se podrán solicitar datos personales adicionales para completar el proceso.</p>
                </li>

                <li>
                <h2>Información sobre las cookies</h2>
                <h3>7.1 ¿Qué son las cookies?</h3>
                <p>Las cookies son pequeños archivos de texto que se descargan en tu dispositivo. También usamos web beacons, etiquetas o SDK. Permiten personalizar tu experiencia y recordar preferencias.</p>

                <h3>7.2 ¿Cómo utiliza ClickRoom las cookies?</h3>
                <ul>
                    <li><strong>Estrictamente necesarias:</strong> indispensables para el funcionamiento de los Servicios.</li>
                    <li><strong>De funcionalidad:</strong> recuerdan tus elecciones (idioma, moneda, etc.).</li>
                    <li><strong>De rendimiento:</strong> analizan el uso de las páginas para mejorar los Servicios.</li>
                    <li><strong>De marketing:</strong> permiten mostrar anuncios relevantes.</li>
                </ul>
                <p>Puedes gestionar tus preferencias de cookies en tu navegador o en <a href="https://www.youronlinechoices.com">youronlinechoices.com</a>.</p>
                </li>

                <li>
                <h2>Transferencia a otros países</h2>
                <p>Podemos transferir tus datos a países fuera de la UE. Si no hay decisión de adecuación, utilizamos Cláusulas Contractuales Estándar. Existe riesgo de acceso por autoridades locales.</p>
                </li>

                <li>
                <h2>¿Cómo protege ClickRoom tus datos?</h2>
                <p>Implementamos medidas técnicas y organizativas (seudonimización, cifrado, firewalls, controles de acceso) y las revisamos continuamente.</p>
                </li>

                <li>
                <h2>¿Cuándo se eliminarán tus datos?</h2>
                <p>Conservamos tus datos mientras sea necesario o esté permitido. Tras ese plazo, los eliminamos, salvo que existan obligaciones legales o prescripciones. Para usos analíticos, usamos datos anónimos.</p>
                </li>
            </ol>
        </div>
      </main>
      <footer style={{ background: '#00163a', color: '#fff', padding: '20px', textAlign: 'center', marginTop: '30px' }}>
        <p><a href='/terycon'>Términos y Condiciones de Uso</a></p>
        <p><a href='/avLeg'>Avisos legales</a></p>
        <p><b>©2025 ClickRoom. Todos los derechos reservados.</b></p>
        <p>Desarrollado por <b>Siminbikini</b></p>
      </footer>
    </div>
  );
}

export default AvPriv;