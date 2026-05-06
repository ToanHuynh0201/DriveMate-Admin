import type {
  InstructorProfile,
  InstructorStatCard,
  WeeklyTeachingData,
  TopicScore,
  ClassProgress,
  TodaySession,
} from '../types';

export const INSTRUCTOR: InstructorProfile = {
  initials: 'NV',
  name: 'Nguyễn Văn A',
  role: 'Giảng viên',
};

export const STAT_CARDS: InstructorStatCard[] = [
  { title: 'Lớp Đang Dạy',     value: '8',    icon: '📖', iconBg: '#f97316' },
  { title: 'Tổng Học Viên',     value: '156',  icon: '👤', iconBg: '#10b981' },
  { title: 'Tỷ Lệ Pass',        value: '89%',  icon: '✅', iconBg: '#3b82f6' },
  { title: 'Giờ Dạy Tháng Này', value: '124h', icon: '🕐', iconBg: '#8b5cf6' },
];

export const WEEKLY_DATA: WeeklyTeachingData[] = [
  { day: 'T2', gioDay: 8,  hocVien: 42 },
  { day: 'T3', gioDay: 6,  hocVien: 35 },
  { day: 'T4', gioDay: 8,  hocVien: 44 },
  { day: 'T5', gioDay: 4,  hocVien: 22 },
  { day: 'T6', gioDay: 8,  hocVien: 48 },
  { day: 'T7', gioDay: 6,  hocVien: 38 },
  { day: 'CN', gioDay: 2,  hocVien: 15 },
];

export const TOPIC_SCORES: TopicScore[] = [
  { topic: 'Biển báo',         score: 85 },
  { topic: 'Luật giao thông',  score: 78 },
  { topic: 'Kỹ thuật lái',     score: 90 },
  { topic: 'Xử lý tình huống', score: 72 },
  { topic: 'An toàn lái xe',   score: 88 },
];

export const CLASS_PROGRESS: ClassProgress[] = [
  { id: '1', name: 'B1 - Sáng T2,T4,T6',  completed: 18, total: 24, percent: 75 },
  { id: '2', name: 'B2 - Chiều T3,T5,T7', completed: 12, total: 20, percent: 60 },
  { id: '3', name: 'A2 - Tối T2,T4',       completed: 14, total: 15, percent: 93 },
  { id: '4', name: 'C - Sáng T3,T5',       completed: 9,  total: 18, percent: 50 },
  { id: '5', name: 'B1 - Chiều T2,T4',     completed: 19, total: 22, percent: 86 },
];

export const TODAY_SESSIONS: TodaySession[] = [
  { id: '1', timeRange: '07:00–09:00', className: 'B1 - Sáng T2,T4,T6',  room: 'Phòng 101', studentCount: 24 },
  { id: '2', timeRange: '14:00–16:00', className: 'B2 - Chiều T3,T5,T7', room: 'Phòng 102', studentCount: 20 },
  { id: '3', timeRange: '18:00–20:00', className: 'A2 - Tối T2,T4',       room: 'Phòng 103', studentCount: 15 },
];

export const DARK_TOOLTIP = {
  contentStyle: {
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#f8fafc',
    fontSize: 13,
  },
  labelStyle: { color: '#f8fafc' },
};
