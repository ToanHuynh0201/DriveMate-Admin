import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserFormData, LicenseClass } from '../../types/user.types';
import { LICENSE_CLASSES } from '../../types/user.types';
import { validateEmail } from '../../utils/authUtils';
import Toast from '../../components/ui/Toast';
import './AddUserPage.css';

const EMPTY_FORM: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: '',
  status: '',
  startDate: '',
  licenseClasses: [],
};

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  status?: string;
}

export default function AddUserPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const update = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleLicense = (cls: LicenseClass) => {
    setForm((prev) => ({
      ...prev,
      licenseClasses: prev.licenseClasses.includes(cls)
        ? prev.licenseClasses.filter((c) => c !== cls)
        : [...prev.licenseClasses, cls],
    }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.firstName.trim()) next.firstName = 'Vui lòng nhập họ và tên đệm.';
    if (!form.lastName.trim()) next.lastName = 'Vui lòng nhập tên.';
    if (!form.email.trim()) {
      next.email = 'Vui lòng nhập email.';
    } else if (!validateEmail(form.email)) {
      next.email = 'Email không hợp lệ.';
    }
    if (!form.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại.';
    if (!form.password) {
      next.password = 'Vui lòng nhập mật khẩu.';
    } else if (form.password.length < 6) {
      next.password = 'Mật khẩu tối thiểu 6 ký tự.';
    }
    if (!form.role) next.role = 'Vui lòng chọn vai trò.';
    if (!form.status) next.status = 'Vui lòng chọn trạng thái.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setToast(true);
    setTimeout(() => navigate('/users'), 1500);
  };

  return (
    <div className="add-user">
      <Toast
        message="Tạo người dùng thành công!"
        type="success"
        visible={toast}
        onClose={() => setToast(false)}
      />

      <button className="add-user__back" onClick={() => navigate('/users')}>
        ← Quay lại
      </button>

      <div className="add-user__header">
        <h1>Thêm Người Dùng Mới</h1>
        <p>Tạo tài khoản mới cho hệ thống</p>
      </div>

      <div className="add-user__body">
        {/* Left column */}
        <div className="add-user__left">
          {/* Basic Info */}
          <div className="add-user__card">
            <h2 className="add-user__card-title">Thông Tin Cơ Bản</h2>

            <div className="add-user__row">
              <div className="add-user__field">
                <label className="add-user__label">Họ và tên đệm</label>
                <input
                  className={`add-user__input${errors.firstName ? ' add-user__input--error' : ''}`}
                  placeholder="Nguyễn Văn"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                />
                {errors.firstName && <span className="add-user__error">{errors.firstName}</span>}
              </div>
              <div className="add-user__field">
                <label className="add-user__label">Tên</label>
                <input
                  className={`add-user__input${errors.lastName ? ' add-user__input--error' : ''}`}
                  placeholder="A"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                />
                {errors.lastName && <span className="add-user__error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="add-user__field">
              <label className="add-user__label">Email</label>
              <input
                className={`add-user__input${errors.email ? ' add-user__input--error' : ''}`}
                type="email"
                placeholder="nguyenvana@email.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
              {errors.email && <span className="add-user__error">{errors.email}</span>}
            </div>

            <div className="add-user__field">
              <label className="add-user__label">Số điện thoại</label>
              <input
                className={`add-user__input${errors.phone ? ' add-user__input--error' : ''}`}
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
              {errors.phone && <span className="add-user__error">{errors.phone}</span>}
            </div>

            <div className="add-user__field">
              <label className="add-user__label">Mật khẩu</label>
              <input
                className={`add-user__input${errors.password ? ' add-user__input--error' : ''}`}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
              {errors.password && <span className="add-user__error">{errors.password}</span>}
            </div>
          </div>

          {/* License Classes */}
          <div className="add-user__card">
            <h2 className="add-user__card-title">Gán Hạng Bằng Lái</h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
              Chọn các hạng bằng lái mà người dùng này có thể giảng dạy
            </p>
            <div className="add-user__license-grid">
              {LICENSE_CLASSES.map((cls) => (
                <label key={cls} className="add-user__license-item">
                  <input
                    type="checkbox"
                    checked={form.licenseClasses.includes(cls)}
                    onChange={() => toggleLicense(cls)}
                  />
                  Hạng {cls}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="add-user__right">
          <div className="add-user__card">
            <h2 className="add-user__card-title">Thông Tin Bổ Sung</h2>

            <div className="add-user__field">
              <label className="add-user__label">Vai trò</label>
              <select
                className={`add-user__select${errors.role ? ' add-user__select--error' : ''}`}
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
              >
                <option value="">Chọn vai trò</option>
                <option value="admin">Admin</option>
                <option value="center_manager">Center Manager</option>
                <option value="instructor">Giảng viên</option>
              </select>
              {errors.role && <span className="add-user__error">{errors.role}</span>}
            </div>

            <div className="add-user__field">
              <label className="add-user__label">Trạng thái</label>
              <select
                className={`add-user__select${errors.status ? ' add-user__select--error' : ''}`}
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
              >
                <option value="">Chọn trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
              {errors.status && <span className="add-user__error">{errors.status}</span>}
            </div>

            <div className="add-user__field">
              <label className="add-user__label">Ngày vào làm</label>
              <input
                className="add-user__input"
                type="date"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </div>
          </div>

          <button
            className="add-user__submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '⏳ Đang tạo...' : '💾 Tạo Mới'}
          </button>

          <button className="add-user__cancel-btn" onClick={() => navigate('/users')}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
