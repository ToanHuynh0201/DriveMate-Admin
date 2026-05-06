import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateOTP } from '../utils/authUtils';
import { OTPInput } from '../components/ui/OTPInput';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { useOTPInput } from '../hooks/useOTPInput';
import './ForgotPasswordPage.css';

export function ForgotPasswordStep2() {
  const navigate = useNavigate();
  const { verifyOTP, resetEmail } = useAuthStore();
  const { digits, otp, inputRefs, handleChange, handleKeyDown, handlePaste } = useOTPInput(6);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resetEmail) {
      navigate('/forgot-password/step1', { replace: true });
    }
  }, [resetEmail, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateOTP(otp)) {
      setError('Vui lòng nhập 6 chữ số OTP');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const isValid = verifyOTP(otp);
      if (isValid) {
        navigate('/forgot-password/step3');
      } else {
        setError('OTP không đúng. Vui lòng thử lại.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="logo-icon">🎓</div>
          <h2>Quên Mật Khẩu</h2>
          <p>Nếu email đã đăng ký, OTP đã được gửi đến email của bạn. Vui lòng check inbox</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <OTPInput
            digits={digits}
            inputRefs={inputRefs}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={loading}
          />

          <ErrorMessage message={error} />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            loadingLabel="Đang xác nhận..."
            disabled={loading || otp.length !== 6}
          >
            Gửi OTP
          </Button>

          <Link to="/forgot-password/step1" className="btn btn--secondary">
            ← Quay lại Đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
}
