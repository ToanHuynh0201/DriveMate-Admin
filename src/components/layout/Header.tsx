import { useLocation } from 'react-router-dom';
import { NotificationBell } from '@/components/common/NotificationBell';
import './Header.css';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Overview Dashboard',
  '/dashboard/giang-vien': 'Instructor Dashboard',
  '/users': 'User Management',
  '/students': 'Student Management',
  '/courses': 'Course Management',
  '/questions': 'Question Bank',
  '/exam-config': 'Exam Configuration',
};

export function Header() {
  const { pathname } = useLocation();
  const title = ROUTE_LABELS[pathname] ?? 'DriveMate Admin';

  return (
    <header className="header">
      <span className="header__title">{title}</span>
      <div className="header__user">
        <NotificationBell />
        <span>Admin</span>
        <div className="header__avatar">A</div>
      </div>
    </header>
  );
}
