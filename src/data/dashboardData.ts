import type { MonthlyTrend, LicenseDistribution, PassRate, RecentActivity, AdminStatCard } from '../types';

export const STAT_CARDS: AdminStatCard[] = [
  {
    title: 'Total Students',
    value: '2,847',
    change: '+12.5%',
    changeLabel: 'vs. last month',
    changeType: 'positive',
    icon: '👥',
    iconBg: '#f97316',
  },
  {
    title: 'Total Courses',
    value: '24',
    change: '+5',
    changeLabel: 'vs. last month',
    changeType: 'positive',
    icon: '📚',
    iconBg: '#10b981',
  },
  {
    title: 'Instructors',
    value: '48',
    change: '+8',
    changeLabel: 'vs. last month',
    changeType: 'positive',
    icon: '👤',
    iconBg: '#3b82f6',
  },
  {
    title: 'Exams Completed',
    value: '1,234',
    change: '-18.2%',
    changeLabel: 'vs. last month',
    changeType: 'negative',
    icon: '📄',
    iconBg: '#8b5cf6',
  },
];

export const monthlyTrend: MonthlyTrend[] = [
  { month: 'Jan', hocVien: 300, baiThi: 200, dat: 160 },
  { month: 'Feb', hocVien: 350, baiThi: 240, dat: 190 },
  { month: 'Mar', hocVien: 380, baiThi: 260, dat: 210 },
  { month: 'Apr', hocVien: 420, baiThi: 300, dat: 250 },
  { month: 'May', hocVien: 480, baiThi: 340, dat: 280 },
  { month: 'Jun', hocVien: 550, baiThi: 380, dat: 320 },
];

export const licenseDistribution: LicenseDistribution[] = [
  { name: 'Class B1', value: 32 },
  { name: 'Class B2', value: 25 },
  { name: 'Class A1', value: 16 },
  { name: 'Class C', value: 13 },
  { name: 'Class A2', value: 13 },
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
  { id: '1', name: 'Nguyen Van A', action: 'Completed B1 course', time: '5 min ago', status: 'success' },
  { id: '2', name: 'Tran Thi B', action: 'Enrolled in A2 course', time: '12 min ago', status: 'neutral' },
  { id: '3', name: 'Le Van C', action: 'Retake exam 2 – Passed', time: '25 min ago', status: 'success' },
  { id: '4', name: 'Pham Thi D', action: 'Retake exam 1 – Failed', time: '1 hour ago', status: 'fail' },
  { id: '5', name: 'Hoang Van E', action: 'Completed practice exam', time: '2 hours ago', status: 'neutral' },
];
