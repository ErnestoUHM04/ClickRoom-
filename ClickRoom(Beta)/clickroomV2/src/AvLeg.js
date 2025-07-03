import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import './App.css';
import logo from './img/ClickRoom.png';
import perfilImg from './img/perfil.jpg';

function AvLeg() {
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
            <h1 style={{textAlign:'center'}}>Avisos legales</h1>
            <p><strong>Última actualización:</strong> <b>julio</b> de 2025</p>
            <p>
                <ul>
                    <li><h2>ClickRoom S.A. de C.V.</h2></li>
                    <li><h2>Dirección:</h2>
                        <ul>
                            <li>ESCOM IPN</li>
                            <li>Unidad Profesional Adolfo López Mateos</li>
                            <li>Av. Juan de Dios Bátiz</li>
                            <li>Nueva Industrial Vallejo</li>
                            <li>Gustavo A. Madero</li>
                            <li>07320</li>
                            <li>Ciudad de México</li>
                            <li>México</li>
                        </ul>
                    </li>
                    <li>
                       <h2> Directores administrativos:</h2>
                        <ul>
                            <li>Johannes Thomas</li>
                            <li>Jasmine Ezz</li>
                            <li>Andrej Lehnert</li>
                            <li>Robin Harries</li>
                        </ul>
                    </li>
                    <li><h3>Correo electrónico: info@clickroom.com.mx</h3></li>
                    <li><h3>Número telefónico: +52 5538873627</h3></li>
                </ul>
            </p>
        </div>
      </main>

      <footer style={{ background: '#00163a', color: '#fff', padding: '20px', textAlign: 'center', marginTop: '30px' }}>
        <p><a href='/terycon'>Términos y Condiciones de Uso</a></p>
        <p><a href='/avPriv'>Aviso de privacidad</a></p>
        <p><b>©2025 ClickRoom. Todos los derechos reservados.</b></p>
        <p>Desarrollado por <b>Siminbikini</b></p>
      </footer>
    </div>
  );
}

export default AvLeg;