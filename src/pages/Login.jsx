import { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { login } from '../features/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'sophie@sigmaschool.co' && password === 'password') {
      dispatch(login({ username, password }));
      navigate('/trip/add');
    } else {
      setError('Please enter a valid username and password');
    }
  };

  return (
    <Container>
      <h2 className="my-3">Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </Form.Group>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <div className="bg-success rounded rounded-full p-3 mt-4 text-white">
        <h5>Credentials</h5>
        <p className="m-0">Username: sophie@sigmaschool.co</p>
        <p className="m-0">Password: password</p>
      </div>
    </Container>
  );
}