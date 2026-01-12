import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, TrendingUp } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <TrendingUp className="logo-icon" />
                    <span>CRM <span className="text-gradient">LeadPlus</span></span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/persons" className={`nav-link ${isActive('/persons') ? 'active' : ''}`}>
                        <Users size={20} />
                        Persons
                    </Link>
                    <Link to="/leads" className={`nav-link ${isActive('/leads') ? 'active' : ''}`}>
                        <UserPlus size={20} />
                        Leads
                    </Link>
                </div>
            </div>
            <style>{`
        .navbar {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          text-decoration: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo-icon {
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-main);
        }
        .nav-link.active {
          color: var(--primary);
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
