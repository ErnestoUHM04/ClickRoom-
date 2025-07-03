import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import './App.css';
import logo from './img/ClickRoom.png';
import perfilImg from './img/perfil.jpg';

function TerYCon() {
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
        <div style={{ textAlign: 'justify', marginTop: '20px', padding: '0 20px'}}>
          <h1 style={{textAlign:'center'}}>Términos y Condiciones</h1>

          <p><strong>ClickRoom</strong> es un buscador de hoteles y ofrece a sus usuarios una plataforma de intercambio de información y experiencias de hospedaje, destinos turísticos, atractivos turísticos y otros servicios relacionados con los viajes.</p>

          <ol>
            <li>
              <h2>Alcance del servicio</h2>
              <ol>
                <li>Estos términos y condiciones están sujetos a cambios ocasionales y aplican a todos nuestros servicios proporcionados directa o indirectamente (p. ej. a través de terceros) a través de Internet, dispositivos móviles, correo electrónico o teléfono.</li>
                <li>Al hacer uso de nuestro sitio web, usted confirma que ha leído, entendido y aceptado estos términos y condiciones, al igual que la política de privacidad, incluyendo el uso de cookies.</li>
              </ol>
            </li>

            <li>
              <h2>Servicios y contratos</h2>
              <ol>
                <li>En el sitio web de ClickRoom usted tiene la capacidad de comparar los servicios de terceros a través del sistema de ClickRoom.</li>
                <li>ClickRoom no es el proveedor de los servicios comparados. El servicio de ClickRoom únicamente incluye la posibilidad de comparar varios servicios ofrecidos por terceros. En particular, ningún contrato por servicios de viaje se concluye a través del uso de la página principal de ClickRoom de acuerdo con el párrafo 651 del Código Civil Alemán.</li>
                <li>Este acuerdo no afecta ningún otro acuerdo entre el hotel y los usuarios.</li>
              </ol>
            </li>

            <li>
              <h2>Comunidad de ClickRoom y zona para miembros</h2>
              <ol>
                <li>Los usuarios podrán unirse a la Comunidad de ClickRoom (en lo sucesivo, «la Comunidad») y crear una cuenta en la zona para miembros de ClickRoom. Los usuarios que se registren en la Comunidad podrán publicar contenido generado por ellos mismos, así como participar activamente en el desarrollo de la plataforma mediante las funciones administrativas. Los usuarios no registrados podrán leer gratis el contenido disponible en ClickRoom.</li>
                <li>Al usar la zona para miembros de ClickRoom, los usuarios podrán gestionar y guardar sus búsquedas. Para crear una cuenta, será necesario aportar datos personales. Aparte del nombre de usuario, ningún otro dato personal será visible. Para obtener más información al respecto, recomendamos consultar la política de privacidad de ClickRoom. Borrar la cuenta supondrá la eliminación de todos los datos del usuario de forma permanente.</li>
                <li>Un mismo usuario no se podrá registrar más de una vez. Además, corresponderá a este asegurarse de que sus datos personales sean correctos y completos.</li>
                <li>Los usuarios serán responsables de velar por la privacidad de los datos de su cuenta, en especial de la contraseña. Asimismo, serán responsables del uso que se haga de su cuenta en relación con ClickRoom y terceros. Queda totalmente prohibido divulgar estos datos para el uso de terceros.</li>
                <li>En el caso de que se haga un uso no autorizado de los servicios de ClickRoom mediante nombre de usuario y una contraseña inapropiados, el usuario registrado deberá notificarlo a ClickRoom inmediatamente.</li>
              </ol>
            </li>

            <li>
              <h2>Privacidad, publicidad por correo electrónico</h2>
              <ol>
                <li>La protección de los datos personales proporcionada por los usuarios es de suma importancia para ClickRoom. Como tal, ClickRoom realiza el mayor esfuerzo para asegurar el cumplimiento de la protección de datos. Para mayor información por favor lea nuestra política de privacidad.</li>
                <li>ClickRoom recolecta, procesa y utiliza sus datos personales (de ahora en adelante “datos”) únicamente si ha obtenido su consentimiento o una disposición legal que permita la recolección, procesamiento o utilización de sus datos.</li>
                <li>ClickRoom recolecta, procesa o utiliza dichos datos que son necesarios para el desempeño de los servicios ofrecidos por ClickRoom y/o para el uso y operación del sitio web/aplicaciones.</li>
                <li>Si el usuario ha aceptado recibir información sobre ClickRoom durante el proceso de registro a la Comunidad o en un momento posterior haciendo uso los servicios de ClickRoom, el usuario recibirá información periódica sobre el producto. El consentimiento puede ser revocado en cualquier momento por escrito o por correo electrónico. El consentimiento para recibir correos electrónicos sigue después de que se ha enviado la confirmación por correo electrónico de la parte de ClickRoom. Al hacer clic en el enlace del correo usted se registrará para recibir boletines de noticias.</li>
              </ol>
            </li>

            <li>
              <h2>Obligaciones de los usuarios</h2>
              <ol>
                <li>El usuario es responsable de la adquisición de los derechos para el contenido (texto, fotos, opiniones, enlaces, etc.) que suben a ClickRoom. Debe asegurarse de que posee todos los derechos del contenido que publica en la plataforma de ClickRoom y, por lo tanto, no viola los derechos de terceros.</li>
                <li>El usuario se compromete a no utilizar los servicios de ClickRoom para crear contenido que:
                  <ol type="a">
                    <li>sea publicidad disfrazada de opiniones,</li>
                    <li>no tenga contenido específico a un hotel,</li>
                    <li>no sea objetivo o sea intencionalmente falso,</li>
                    <li>sea inmoral, pornográfico o de cualquier otra manera ofensivo,</li>
                    <li>infrinja los derechos de terceros, en particular los derechos de autor,</li>
                    <li>viole las leyes aplicables en cualquier forma o constituya un delito,</li>
                    <li>contenga virus u otros programas de computadora que puedan dañar el software o hardware o que puedan afectar el uso de computadoras,</li>
                    <li>sea una encuesta o cadena,</li>
                    <li>tenga por objetivo el recolectar o utilizar los datos personales de otros usuarios, especialmente para fines comerciales.</li>
                  </ol>
                </li>
                <li>El usuario se compromete a no usar programas o funciones para generar impresiones de páginas automatizadas o contenidos en ClickRoom.</li>
                <li>Si hay un incumplimiento en los términos y condiciones, ClickRoom se reserva el derecho a eliminar el contenido sin declaración de razón, a retener los pagos obtenidos en la Comunidad de ClickRoom y a prohibir miembros de ClickRoom permanentemente. El derecho a la persecución de los actos delictivos no se ve afectado.</li>
              </ol>
            </li>

            <li>
              <h2>Terminación</h2>
              <ol>
                <li>ClickRoom se reserva el derecho a terminar el acceso de un usuario y a eliminar su registro dentro de un período de una semana después de la recepción de la información pertinente a través de correo electrónico sobre el uso inadecuado del sitio web. El usuario también puede terminar su propio acceso y registro dentro del mismo período. El derecho de terminación inmediata por justa causa no se ve afectado.</li>
              </ol>
            </li>

            <li>
              <h2>Responsabilidad</h2>
              <ol>
                <li>ClickRoom no es responsable de la exactitud, calidad, integridad, fiabilidad o credibilidad del contenido aportado por los usuarios y/o los sitios de reservaciones. En particular, no hay consejo o información de la parte de ClickRoom sobre la selección de alojamientos.</li>
                <li>Todos los acuerdos que surgen a través de este servicio son entre el usuario de ClickRoom y el respectivo sitio de reservaciones externo contratado. En particular, ClickRoom no actúa como organizador o agencia de viajes en ningún momento. Los términos y condiciones del organizador o agencia de viajes respectivo aplican exclusivamente en relación con el derecho de cancelación y retiro.</li>
                <li>ClickRoom no verifica la exactitud del contenido subido por los sitios de reservaciones o los miembros de la Comunidad. Este contenido es proporcionado por los sitios de reservaciones/Comunidad para su publicación en nuestro sitio web. ClickRoom no tiene influencia en el contenido (imágenes, comentarios, opiniones, etc.). La publicación del contenido y reportes generados por los usuarios no reflejan la opinión de ClickRoom.</li>
                <li>Los hipervínculos, banners de publicidad, información sobre alojamientos, destinos de viaje o proveedores y similares son proporcionados por los sitios de reservaciones y los miembros de la Comunidad y no representan recomendaciones o información de la parte de ClickRoom. Las actualizaciones de precios no se hacen en tiempo real; puede haber discrepancias con los precios especificados en las páginas de ClickRoom.</li>
                <li>ClickRoom no es responsable de los errores técnicos cuya causa está fuera de su ámbito de responsabilidad o por daños causados por fuerza mayor. ClickRoom no garantiza la disponibilidad ininterrumpida de datos y puede realizar tareas de mantenimiento en cualquier momento.</li>
              </ol>
            </li>

            <li>
              <h2>Cambios a los términos y condiciones</h2>
              <p>Los términos y condiciones actuales aplican al usar ClickRoom. Los usuarios registrados reciben notificaciones sobre cambios a través de correo electrónico. Los usuarios pueden descargar e imprimir los términos y condiciones actuales en su propio sistema de computadora.</p>
            </li>

            <li>
              <h2>Ley aplicable y jurisdicción</h2>
              <p>Las leyes de la República Federal de Alemania aplican. Para personas morales o físicas que no tienen jurisdicción general en Alemania, Düsseldorf aplica como lugar de jurisdicción. De lo contrario, la jurisdicción legal aplica. La versión en alemán de este documento tiene precedencia.</p>
            </li>
          </ol>
        </div>
      </main>

      <footer style={{ background: '#00163a', color: '#fff', padding: '20px', textAlign: 'center', marginTop: '30px' }}>
        <p><a href='/avPriv'>Aviso de privacidad</a></p>
        <p><a href='/avLeg'>Avisos legales</a></p>
        <p><b>©2025 ClickRoom. Todos los derechos reservados.</b></p>
        <p>Desarrollado por <b>Siminbikini</b></p>
      </footer>
    </div>
  );
}

export default TerYCon;