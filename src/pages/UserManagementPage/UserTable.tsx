import type { IdentityUser, UserRole } from "@/types/identity.types";
import { ROLE_LABELS } from "@/types/identity.types";

interface Props {
  users: IdentityUser[];
  togglingId: string | null;
  onToggleStatus: (user: IdentityUser) => void;
  onEdit: (user: IdentityUser) => void;
  onChangeRole: (user: IdentityUser) => void;
  onDelete: (user: IdentityUser) => void;
}

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  ADMIN: "badge badge--admin",
  CENTER_MANAGER: "badge badge--manager",
  INSTRUCTOR: "badge badge--instructor",
  STUDENT: "badge badge--student",
};

const AVATAR_PALETTE = [
  "#F5A623",
  "#4A90E2",
  "#7ED321",
  "#9B59B6",
  "#E74C3C",
  "#16A085",
];

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
}

function RoleBadge({ role }: { role: UserRole }) {
  return <span className={ROLE_BADGE_CLASS[role]}>{ROLE_LABELS[role]}</span>;
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`badge ${isActive ? "badge--active" : "badge--inactive"}`}>
      {isActive ? "Hoạt động" : "Tạm dừng"}
    </span>
  );
}

export default function UserTable({ users, togglingId, onToggleStatus, onEdit, onChangeRole, onDelete }: Props) {
  if (users.length === 0) {
    return (
      <div className="user-table__empty">
        <p>Không tìm thấy người dùng nào.</p>
      </div>
    );
  }

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Vai Trò</th>
            <th>Trạng Thái</th>
            <th>Ngày Tạo</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>
                <div className="user-table__name-cell">
                  <div
                    className="user-table__avatar"
                    style={{ background: getAvatarColor(user.userId) }}>
                    {getInitials(user.fullName)}
                  </div>
                  <span className="user-table__fullname">{user.fullName}</span>
                </div>
              </td>
              <td className="user-table__email">{user.email}</td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td>
                <StatusBadge isActive={user.isActive} />
              </td>
              <td className="user-table__date">{formatDate(user.createdAt)}</td>
              <td>
                <div className="user-table__actions">
                  <button
                    className={`action-btn ${
                      user.isActive
                        ? "action-btn--deactivate"
                        : "action-btn--activate"
                    }`}
                    title={user.isActive ? "Khóa đăng nhập" : "Mở khóa"}
                    disabled={togglingId === user.userId}
                    onClick={() => onToggleStatus(user)}>
                    {togglingId === user.userId
                      ? "⏳"
                      : user.isActive
                        ? "⏸"
                        : "▶"}
                  </button>
                  <button
                    className="action-btn action-btn--edit"
                    title="Sửa thông tin"
                    disabled={togglingId === user.userId || user.isDeleted}
                    onClick={() => onEdit(user)}>
                    ✏️
                  </button>
                  <button
                    className="action-btn action-btn--role"
                    title="Đổi vai trò"
                    disabled={togglingId === user.userId || user.isDeleted}
                    onClick={() => onChangeRole(user)}>
                    🔑
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    title="Xóa tài khoản"
                    disabled={togglingId === user.userId || user.isDeleted}
                    onClick={() => onDelete(user)}>
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
