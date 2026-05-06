import type { MonthlyTrend, LicenseDistribution, PassRate, RecentActivity, AdminStatCard } from '../types';

export const STAT_CARDS: AdminStatCard[] = [
  {
    title: 'Tổng Học Viên',
    value: '2,847',
    change: '+12.5%',
    changeLabel: 'so với tháng trước',
    changeType: 'positive',
    icon: '👥',
    iconBg: '#f97316',
  },
  {
    title: 'Tổng Khóa Học',
    value: '24',
    change: '+5',
    changeLabel: 'so với tháng trước',
    changeType: 'positive',
    icon: '📚',
    iconBg: '#10b981',
  },
  {
    title: 'Giảng Viên',
    value: '48',
    change: '+8',
    changeLabel: 'so với tháng trước',
    changeType: 'positive',
    icon: '👤',
    iconBg: '#3b82f6',
  },
  {
    title: 'Bài Thi Hoàn Thành',
    value: '1,234',
    change: '-18.2%',
    changeLabel: 'so với tháng trước',
    changeType: 'negative',
    icon: '📄',
    iconBg: '#8b5cf6',
  },
];

export const monthlyTrend: MonthlyTrend[] = [
  { month: 'T1', hocVien: 300, baiThi: 200, dat: 160 },
  { month: 'T2', hocVien: 350, baiThi: 240, dat: 190 },
  { month: 'T3', hocVien: 380, baiThi: 260, dat: 210 },
  { month: 'T4', hocVien: 420, baiThi: 300, dat: 250 },
  { month: 'T5', hocVien: 480, baiThi: 340, dat: 280 },
  { month: 'T6', hocVien: 550, baiThi: 380, dat: 320 },
];

export const licenseDistribution: LicenseDistribution[] = [
  { name: 'Hạng B1', value: 32 },
  { name: 'Hạng B2', value: 25 },
  { name: 'Hạng A1', value: 16 },
  { name: 'Hạng C', value: 13 },
  { name: 'Hạng A2', value: 13 },
];

export const PIE_COLORS = ['#f59e0b', '#2563eb', '#10b981', '#8b5cf6', '#ef4444'];

export const passRates: PassRate[] = [
  { hang: 'A1', rate: 78 },
  { hang: 'A2', rate: 82 },
  { hang: 'B1', rate: 85 },
  { hang: 'B2', rate: 79 },
  { hang: 'C', rate: 76 },
];

export const recentActivities: RecentActivity[] = [
  { id: '1', name: 'Nguyễn Văn A', action: 'Hoàn thành khóa học B1', time: '5 phút trước', status: 'success' },
  { id: '2', name: 'Trần Thị B', action: 'Đăng ký khóa học A2', time: '12 phút trước', status: 'neutral' },
  { id: '3', name: 'Lê Văn C', action: 'Thi lại lần 2 – Đạt', time: '25 phút trước', status: 'success' },
  { id: '4', name: 'Phạm Thị D', action: 'Thi lại lần 1 – Không đạt', time: '1 giờ trước', status: 'fail' },
  { id: '5', name: 'Hoàng Văn E', action: 'Hoàn thành bài thi thử', time: '2 giờ trước', status: 'neutral' },
];
