import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <div>Dashboard — coming soon</div>,
      },
    ],
  },
  {
    path: '*',
    element: <div style={{ padding: 40, textAlign: 'center' }}>404 — Trang không tìm thấy</div>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
