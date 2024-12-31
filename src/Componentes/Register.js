import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Simular registro de usuario
    if (username && password && email) {
      console.log('Usuario registrado:', { username, email });
      navigate('/'); // Redirigir al login después del registro
    } else {
      setError('Por favor, completa todos los campos.');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-4">Regístrate</h1>
      <form onSubmit={handleRegister} className="mt-4 w-50">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          Registrarse
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
      <p className="mt-4">
        ¿Ya tienes una cuenta?{' '}
        <span
          className="text-primary"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Inicia sesión
        </span>
      </p>
    </div>
  );
};

export default Register;
