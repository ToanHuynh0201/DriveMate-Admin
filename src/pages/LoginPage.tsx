import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateEmail } from '../utils/authUtils';
import { FormGroup } from '../components/ui/FormGroup';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { clearError(); };
  }, [clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Vui lòng nhập email');
      return;
    }
    if (!validateEmail(email)) {
      setLocalError('Email không hợp lệ');
      return;
    }
    if (!password.trim()) {
      setLocalError('Vui lòng nhập mật khẩu');
      return;
    }

    login({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">🎓</div>
          <h1>Driving School</h1>
          <p>Hệ Thống Quản Lý Luyện Thi</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <FormGroup label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@drivingschool.vn"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup label="Mật khẩu">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </FormGroup>

          <ErrorMessage message={localError || error} />

          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" disabled={loading} />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password/step1" className="forgot-password-link">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading} loadingLabel="Đang đăng nhập...">
            Đăng Nhập
          </Button>
        </form>

        <p className="login-footer">© 2026 Driving School. All rights reserved.</p>
      </div>
    </div>
  );
}
