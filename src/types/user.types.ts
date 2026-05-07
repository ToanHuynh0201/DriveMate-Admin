export type UserRole = 'admin' | 'center_manager' | 'instructor';
export type UserStatus = 'active' | 'inactive';
export type LicenseClass = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D' | 'E' | 'F';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  licenseClasses: LicenseClass[];
  startDate: string;
  createdAt: string;
  avatarColor: string;
}

export interface UserFilters {
  search: string;
  role: UserRole | '';
  status: UserStatus | '';
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole | '';
  status: UserStatus | '';
  startDate: string;
  licenseClasses: LicenseClass[];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  center_manager: 'Center Manager',
  instructor: 'Giảng viên',
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Tạm dừng',
};

export const LICENSE_CLASSES: LicenseClass[] = ['A1', 'A2', 'B1', 'B2', 'C', 'D', 'E', 'F'];
