import type { User } from '../../types/user.types';
import { ROLE_LABELS, STATUS_LABELS } from '../../types/user.types';

interface Props {
  users: User[];
  onToggleStatus: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

function getInitials(user: User) {
  return (user.firstName.trim().slice(-1) + user.lastName.trim().slice(0, 1)).toUpperCase();
}

function RoleBadge({ role }: { role: User['role'] }) {
  const classes: Record<User['role'], string> = {
    admin: 'badge badge--admin',
    center_manager: 'badge badge--manager',
    instructor: 'badge badge--instructor',
  };
  return <span className={classes[role]}>{ROLE_LABELS[role]}</span>;
}

function StatusBadge({ status }: { status: User['status'] }) {
  return (
    <span className={`badge ${status === 'active' ? 'badge--active' : 'badge--inactive'}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function UserTable({ users, onToggleStatus, onView, onEdit }: Props) {
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
            <th>Hạng Bằng</th>
            <th>Ngày Tạo</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-table__name-cell">
                  <div
                    className="user-table__avatar"
                    style={{ background: user.avatarColor }}
                  >
                    {getInitials(user)}
                  </div>
                  <span className="user-table__fullname">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </td>
              <td className="user-table__email">{user.email}</td>
              <td><RoleBadge role={user.role} /></td>
              <td><StatusBadge status={user.status} /></td>
              <td>
                <div className="user-table__licenses">
                  {user.licenseClasses.map((cls) => (
                    <span key={cls} className="badge badge--license">{cls}</span>
                  ))}
                </div>
              </td>
              <td className="user-table__date">{user.createdAt}</td>
              <td>
                <div className="user-table__actions">
                  <button
                    className="action-btn action-btn--view"
                    title="Xem chi tiết"
                    onClick={() => onView(user.id)}
                  >
                    👁
                  </button>
                  <button
                    className="action-btn action-btn--edit"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(user.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className={`action-btn ${user.status === 'active' ? 'action-btn--deactivate' : 'action-btn--activate'}`}
                    title={user.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                    onClick={() => onToggleStatus(user.id)}
                  >
                    {user.status === 'active' ? '⏸' : '▶'}
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
