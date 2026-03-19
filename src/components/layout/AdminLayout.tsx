import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AdminLayout.css';

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <div className="admin-layout__sidebar">
        <Sidebar />
      </div>
      <div className="admin-layout__header">
        <Header />
      </div>
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
