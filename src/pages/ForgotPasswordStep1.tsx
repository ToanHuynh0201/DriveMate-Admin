import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateEmail } from '../utils/authUtils';
import { FormGroup } from '../components/ui/FormGroup';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import './ForgotPasswordPage.css';

export function ForgotPasswordStep1() {
  const navigate = useNavigate();
  const { requestPasswordReset, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => { clearError(); };
  }, [clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      requestPasswordReset(email);
      navigate('/forgot-password/step2');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="logo-icon">🎓</div>
          <h2>Quên Mật Khẩu</h2>
          <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <FormGroup label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@drivingschool.vn"
              disabled={loading}
            />
          </FormGroup>

          <ErrorMessage message={error} />

          <Button type="submit" fullWidth loading={loading} loadingLabel="Đang gửi...">
            Gửi OTP
          </Button>

          <Link to="/login" className="btn btn--secondary">
            ← Quay lại Đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
}
