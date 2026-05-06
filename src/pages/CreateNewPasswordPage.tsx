import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validatePassword, validatePasswordMatch } from '../utils/authUtils';
import { PasswordInput } from '../components/ui/PasswordInput';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import './ForgotPasswordPage.css';

export function CreateNewPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, resetOtpVerified, error: storeError, clearError } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = validatePasswordMatch(newPassword, confirmPassword);

  useEffect(() => {
    if (!resetOtpVerified) {
      navigate('/forgot-password/step1', { replace: true });
    }
  }, [resetOtpVerified, navigate]);

  useEffect(() => {
    return () => { clearError(); };
  }, [clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (!passwordValidation.isValid) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('Vui lòng xác nhận mật khẩu');
      return;
    }
    if (!passwordsMatch) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      resetPassword(newPassword);
      navigate('/login', { replace: true });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card large">
        <div className="forgot-password-header">
          <div className="logo-icon">🎓</div>
          <h2>Tạo Mật Khẩu Mới</h2>
          <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <PasswordInput
            label="Mật khẩu mới"
            value={newPassword}
            onChange={setNewPassword}
            disabled={loading}
          />

          {newPassword && (
            <div className="password-validation">
              <div className={`validation-item ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
                ✓ Ít nhất 8 ký tự
              </div>
              <div className={`validation-item ${(passwordValidation.hasUpperCase && passwordValidation.hasLowerCase) ? 'valid' : 'invalid'}`}>
                ✓ Bao gồm chữ hoa và chữ thường
              </div>
              <div className={`validation-item ${passwordValidation.hasNumber ? 'valid' : 'invalid'}`}>
                ✓ Có ít nhất 1 số
              </div>
            </div>
          )}

          <PasswordInput
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={loading}
            helpText={
              confirmPassword
                ? passwordsMatch
                  ? '✓ Mật khẩu khớp'
                  : '✗ Mật khẩu không khớp'
                : undefined
            }
            helpTextVariant={
              confirmPassword ? (passwordsMatch ? 'success' : 'error') : 'default'
            }
          />

          <ErrorMessage message={error || storeError} />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            loadingLabel="Đang đặt lại mật khẩu..."
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
          >
            Đặt Lại Mật Khẩu
          </Button>
        </form>
      </div>
    </div>
  );
}
