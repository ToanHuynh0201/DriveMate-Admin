import { useEffect, useState } from 'react';
import { courseService, examService, identityService, userService } from '@/services';
import { monthlyTrend, licenseDistribution, passRates, PIE_COLORS, recentActivities } from '../../data/dashboardData';
import type { AdminStatCard } from '../../types';
import { StatCardsSection } from './StatCardsSection';
import { ChartsSection } from './ChartsSection';
import { ActivitySection } from './ActivitySection';
import './index.css';

function useDashboardCounts() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, instructors: 0, completedSessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.list({ role: 'STUDENT', size: 1 }),
      courseService.list({ size: 1 }),
      identityService.list({ role: 'INSTRUCTOR', size: 1 }),
      examService.listSessions({ status: 'COMPLETED', size: 1 }),
    ]).then(([students, courses, instructors, sessions]) => {
      setCounts({
        students: students.success ? students.data.total : 0,
        courses: courses.success ? courses.data.total : 0,
        instructors: instructors.success ? instructors.data.total : 0,
        completedSessions: sessions.success ? sessions.data.total : 0,
      });
      setLoading(false);
    });
  }, []);

  return { counts, loading };
}

export function DashboardPage() {
  const { counts, loading } = useDashboardCounts();

  const statCards: AdminStatCard[] = [
    {
      title: 'Tổng Học Viên',
      value: loading ? '...' : counts.students.toLocaleString('vi-VN'),
      icon: '👥',
      iconBg: '#f97316',
    },
    {
      title: 'Tổng Khóa Học',
      value: loading ? '...' : counts.courses.toLocaleString('vi-VN'),
      icon: '📚',
      iconBg: '#10b981',
    },
    {
      title: 'Giảng Viên',
      value: loading ? '...' : counts.instructors.toLocaleString('vi-VN'),
      icon: '👤',
      iconBg: '#3b82f6',
    },
    {
      title: 'Bài Thi Hoàn Thành',
      value: loading ? '...' : counts.completedSessions.toLocaleString('vi-VN'),
      icon: '📄',
      iconBg: '#8b5cf6',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard Tổng Quan</h1>
        <p>Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
      </div>

      <StatCardsSection cards={statCards} />
      <ChartsSection
        monthlyTrend={monthlyTrend}
        licenseDistribution={licenseDistribution}
        passRates={passRates}
        pieColors={PIE_COLORS}
      />
      <ActivitySection activities={recentActivities} />
    </div>
  );
}
