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
      setError('Please enter a new password.');
      return;
    }
    if (!passwordValidation.isValid) {
      setError('Password does not meet complexity requirements.');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('Please confirm your password.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
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
          <h2>Create New Password</h2>
          <p>Enter a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            disabled={loading}
          />

          {newPassword && (
            <div className="password-validation">
              <div className={`validation-item ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
                ✓ At least 8 characters
              </div>
              <div className={`validation-item ${(passwordValidation.hasUpperCase && passwordValidation.hasLowerCase) ? 'valid' : 'invalid'}`}>
                ✓ Includes uppercase and lowercase letters
              </div>
              <div className={`validation-item ${passwordValidation.hasNumber ? 'valid' : 'invalid'}`}>
                ✓ Contains at least 1 number
              </div>
            </div>
          )}

          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={loading}
            helpText={
              confirmPassword
                ? passwordsMatch
                  ? '✓ Passwords match'
                  : '✗ Passwords do not match'
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
            loadingLabel="Resetting password..."
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
