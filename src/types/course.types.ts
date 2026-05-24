export type LicenseCategory = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D' | 'E' | 'F';
export type CourseStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  content: string | null;
  order: number;
  createdAt: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  fileUrl: string | null;
  mediaFileId: string | null;
  type: string | null;
  createdAt: string;
}

export interface CourseRequirement {
  id: string;
  minAge: number | null;
  prerequisites: string | null;
  attendanceRate: number;
  minPassScore: number;
  requiredExams: number;
}

export interface CourseResponse {
  id: string;
  title: string;
  description: string | null;
  licenseCategory: LicenseCategory;
  totalLessons: number;
  duration: string | null;
  tuitionFee: number;
  capacity: number | null;
  status: CourseStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  lessons: CourseLesson[];
  instructorIds: string[];
  requirement: CourseRequirement | null;
  materials: CourseMaterial[];
}

export interface CourseFilters {
  search: string;
  licenseCategory: LicenseCategory | '';
  status: CourseStatus | '';
}

export interface CreateCoursePayload {
  title: string;
  licenseCategory: LicenseCategory;
  description?: string;
  duration?: string;
  tuitionFee?: number;
  capacity?: number;
  instructorIds?: string[];
  requirement?: {
    minAge?: number;
    prerequisites?: string;
    attendanceRate?: number;
    minPassScore?: number;
    requiredExams?: number;
  };
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  duration?: string;
  tuitionFee?: number;
  capacity?: number;
  requirement?: {
    minAge?: number;
    prerequisites?: string;
    attendanceRate?: number;
    minPassScore?: number;
    requiredExams?: number;
  };
}

export interface AddLessonPayload {
  title: string;
  order: number;
  content?: string;
}

export interface AddMaterialPayload {
  title: string;
  fileUrl?: string;
  mediaFileId?: string;
  type?: string;
}

export interface CourseFormData {
  title: string;
  licenseCategory: LicenseCategory | '';
  description: string;
  duration: string;
  tuitionFee: number;
  capacity: number;
  instructorIds: string[];
  requirement: {
    minAge: number;
    prerequisites: string;
    attendanceRate: number;
    minPassScore: number;
    requiredExams: number;
  };
}

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  DRAFT: 'Bản nháp',
  ACTIVE: 'Đang hoạt động',
  ARCHIVED: 'Đã lưu trữ',
};

export const COURSE_LICENSE_CATEGORIES: LicenseCategory[] = ['A1', 'A2', 'B1', 'B2', 'C', 'D', 'E', 'F'];

export const COURSE_STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'ARCHIVED', label: 'Đã lưu trữ' },
];
