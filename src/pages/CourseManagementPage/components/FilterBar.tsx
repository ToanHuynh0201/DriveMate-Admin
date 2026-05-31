import type { CourseFilters, CourseStatus, LicenseCategory } from "@/types/course.types";
import {
	COURSE_LICENSE_CATEGORIES,
	COURSE_STATUS_OPTIONS,
} from "@/types/course.types";

interface FilterBarProps {
	filters: CourseFilters;
	onChange: (next: CourseFilters) => void;
	lockedLicenseCategory?: LicenseCategory | "";
}

export function FilterBar({
	filters,
	onChange,
	lockedLicenseCategory = "",
}: FilterBarProps) {
	const update = (patch: Partial<CourseFilters>) => onChange({ ...filters, ...patch });
	const licenseValue = lockedLicenseCategory || filters.licenseCategory;

	return (
		<div className="course-filters">
			<div className="course-filters__search">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
				<input
					value={filters.search}
					onChange={(e) => update({ search: e.target.value })}
					placeholder="Tìm kiếm khóa học..."
				/>
			</div>

			<select
				value={licenseValue}
				disabled={Boolean(lockedLicenseCategory)}
				onChange={(e) => update({ licenseCategory: e.target.value as LicenseCategory | "" })}>
				<option value="">Tất cả hạng</option>
				{COURSE_LICENSE_CATEGORIES.map((cls) => (
					<option key={cls} value={cls}>{cls}</option>
				))}
			</select>

			<select value={filters.status} onChange={(e) => update({ status: e.target.value as CourseStatus | "" })}>
				<option value="">Tất cả</option>
				{COURSE_STATUS_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>{opt.label}</option>
				))}
			</select>

			<button
				className="course-filters__reset"
				onClick={() =>
					onChange({
						search: "",
						licenseCategory: lockedLicenseCategory || "",
						status: "",
					})
				}
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M3 6h18M6 6V4h12v2M19 6l-1 14H6L5 6" />
				</svg>
				Đặt lại
			</button>
		</div>
	);
}
