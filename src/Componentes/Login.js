import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Slice/authSlice'; // Acción para loguear usuario
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('juan');
  const [password, setPassword] = useState('123');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: productsLoading, error: productsError } = useSelector((state) => state.products); // Estado de productos
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth); // Estado de autenticación

  const handleLogin = (e) => {
    e.preventDefault();

    // Disparar acción para loguear usuario
    dispatch(loginUser({ name: username, password })).then((action) => {
      if (action.type === 'auth/loginUser/fulfilled') {
        navigate('/products');
      }
    });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-4">Inicia sesión</h1>
      <form onSubmit={handleLogin} className="mt-4 w-50">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={authLoading || productsLoading}
        >
          {authLoading || productsLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
        {authError && <p className="text-danger mt-3">{authError}</p>}
        {productsError && <p className="text-danger mt-3">Error al cargar productos</p>}
      </form>
    </div>
  );
};

export default Login;
