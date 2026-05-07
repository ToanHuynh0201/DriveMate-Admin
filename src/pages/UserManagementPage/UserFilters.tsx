import type { UserFilters as UserFiltersType } from '../../types/user.types';

interface Props {
  filters: UserFiltersType;
  onChange: (filters: UserFiltersType) => void;
}

export default function UserFilters({ filters, onChange }: Props) {
  const update = (patch: Partial<UserFiltersType>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="user-filters">
      <div className="user-filters__search">
        <span className="user-filters__search-icon">🔍</span>
        <input
          className="user-filters__input"
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>

      <select
        className="user-filters__select"
        value={filters.role}
        onChange={(e) => update({ role: e.target.value as UserFiltersType['role'] })}
      >
        <option value="">Vai trò</option>
        <option value="admin">Admin</option>
        <option value="center_manager">Center Manager</option>
        <option value="instructor">Giảng viên</option>
      </select>

      <select
        className="user-filters__select"
        value={filters.status}
        onChange={(e) => update({ status: e.target.value as UserFiltersType['status'] })}
      >
        <option value="">Trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Tạm dừng</option>
      </select>

      <button className="user-filters__btn" onClick={() => onChange({ search: '', role: '', status: '' })}>
        <span>⊘</span> Xóa lọc
      </button>
    </div>
  );
}
