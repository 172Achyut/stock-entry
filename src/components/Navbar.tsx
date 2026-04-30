import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <span className="navbar-brand">StockEntry</span>
      <div className="navbar-links">
        <Link className={pathname === '/' ? 'active' : ''} to="/">
          Home
        </Link>
        <Link className={pathname === '/post' ? 'active' : ''} to="/post">
          Add Suggestion
        </Link>
      </div>
    </nav>
  );
}
