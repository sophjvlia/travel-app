import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './pages/Home'
import AddTrip from './pages/AddTrip'
import ViewTrip from './pages/ViewTrip'
import Login from './pages/Login'
import { logout } from './features/user/userSlice'

export function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/trips">Travel App</Navbar.Brand>
          {isAuthenticated ? (
            <>
              <Nav className="d-flex justify-content-end pe-3 w-100">
                <Nav.Link href="/trip/add">
                  Add Trip
                </Nav.Link>
              </Nav>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Nav>
              <Nav.Link href="/login">
                Login
              </Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
      <Outlet/>
    </>
  );
}

const AuthGuard = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return element;
};

const HomeRedirect = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  
  return <Navigate to={isAuthenticated ? "/trips" : "/login"} />;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/" element={<Layout/>}>
            <Route path="/trips" element={<AuthGuard element={<Home/>}/>}/>
            <Route path="/trip/add" element={<AuthGuard element={<AddTrip/>}/>}/>
            <Route path="/trip/view/:id" element={<AuthGuard element={<ViewTrip/>}/>}/>
            <Route path="login" element={<Login/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
