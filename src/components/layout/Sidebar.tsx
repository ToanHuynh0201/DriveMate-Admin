import { NavLink, useNavigate } from 'react-router-dom';
import type { NavItem } from '../../types';
import { useAuthStore } from '../../store/authStore';
import './Sidebar.css';

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Instructor Dashboard', path: '/dashboard/giang-vien', icon: '👨‍🏫' },
  { label: 'User Management', path: '/users', icon: '👥' },
  { label: 'Student Management', path: '/students', icon: '🎓' },
  { label: 'Course Management', path: '/courses', icon: '📚' },
  { label: 'Question Bank', path: '/questions', icon: '❓' },
  { label: 'Exam Configuration', path: '/exam-config', icon: '⚙️' },
];

export function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-text">Driving School</span>
        <span className="sidebar__logo-sub">Driving Test Management</span>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
            }
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <span className="sidebar__nav-icon">→</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
