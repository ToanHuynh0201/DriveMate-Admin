import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import type {
  InstructorProfile,
  InstructorStatCard,
  WeeklyTeachingData,
  TopicScore,
  ClassProgress,
  TodaySession,
} from '../types';
import './DashboardGiangVienPage.css';

const INSTRUCTOR: InstructorProfile = {
  initials: 'NV',
  name: 'Nguyễn Văn A',
  role: 'Giảng viên',
};

const STAT_CARDS: InstructorStatCard[] = [
  { title: 'Lớp Đang Dạy',     value: '8',    icon: '📖', iconBg: '#f97316' },
  { title: 'Tổng Học Viên',     value: '156',  icon: '👤', iconBg: '#10b981' },
  { title: 'Tỷ Lệ Pass',        value: '89%',  icon: '✅', iconBg: '#3b82f6' },
  { title: 'Giờ Dạy Tháng Này', value: '124h', icon: '🕐', iconBg: '#8b5cf6' },
];

const WEEKLY_DATA: WeeklyTeachingData[] = [
  { day: 'T2', gioDay: 8,  hocVien: 42 },
  { day: 'T3', gioDay: 6,  hocVien: 35 },
  { day: 'T4', gioDay: 8,  hocVien: 44 },
  { day: 'T5', gioDay: 4,  hocVien: 22 },
  { day: 'T6', gioDay: 8,  hocVien: 48 },
  { day: 'T7', gioDay: 6,  hocVien: 38 },
  { day: 'CN', gioDay: 2,  hocVien: 15 },
];

const TOPIC_SCORES: TopicScore[] = [
  { topic: 'Biển báo',         score: 85 },
  { topic: 'Luật giao thông',  score: 78 },
  { topic: 'Kỹ thuật lái',     score: 90 },
  { topic: 'Xử lý tình huống', score: 72 },
  { topic: 'An toàn lái xe',   score: 88 },
];

const CLASS_PROGRESS: ClassProgress[] = [
  { id: '1', name: 'B1 - Sáng T2,T4,T6',  completed: 18, total: 24, percent: 75 },
  { id: '2', name: 'B2 - Chiều T3,T5,T7', completed: 12, total: 20, percent: 60 },
  { id: '3', name: 'A2 - Tối T2,T4',       completed: 14, total: 15, percent: 93 },
  { id: '4', name: 'C - Sáng T3,T5',       completed: 9,  total: 18, percent: 50 },
  { id: '5', name: 'B1 - Chiều T2,T4',     completed: 19, total: 22, percent: 86 },
];

const TODAY_SESSIONS: TodaySession[] = [
  { id: '1', timeRange: '07:00–09:00', className: 'B1 - Sáng T2,T4,T6',  room: 'Phòng 101', studentCount: 24 },
  { id: '2', timeRange: '14:00–16:00', className: 'B2 - Chiều T3,T5,T7', room: 'Phòng 102', studentCount: 20 },
  { id: '3', timeRange: '18:00–20:00', className: 'A2 - Tối T2,T4',       room: 'Phòng 103', studentCount: 15 },
];

const DARK_TOOLTIP = {
  contentStyle: {
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: '#f8fafc',
    fontSize: 13,
  },
  labelStyle: { color: '#f8fafc' },
};

export function DashboardGiangVienPage() {
  return (
    <div className="gv-dashboard">

      {/* Header */}
      <div className="gv-dashboard__header">
        <div className="gv-dashboard__header-text">
          <h1 className="gv-dashboard__title">Dashboard Giảng Viên</h1>
          <p className="gv-dashboard__subtitle">
            Theo dõi tiến độ giảng dạy và kết quả học viên
          </p>
        </div>
        <div className="gv-profile-card">
          <div className="gv-profile-card__avatar">{INSTRUCTOR.initials}</div>
          <div className="gv-profile-card__info">
            <span className="gv-profile-card__name">{INSTRUCTOR.name}</span>
            <span className="gv-profile-card__role">{INSTRUCTOR.role}</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="gv-stats-grid">
        {STAT_CARDS.map((card) => (
          <div key={card.title} className="gv-stat-card">
            <div className="gv-stat-card__info">
              <div className="gv-stat-card__title">{card.title}</div>
              <div className="gv-stat-card__value">{card.value}</div>
            </div>
            <div className="gv-stat-card__icon" style={{ background: card.iconBg }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="gv-charts-row">
        <div className="gv-chart-card">
          <div className="gv-chart-card__title">Giờ Dạy & Học Viên Theo Tuần</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis domain={[0, 60]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...DARK_TOOLTIP} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="gioDay"
                name="Giờ dạy"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="hocVien"
                name="Học viên"
                stroke="#fdb913"
                strokeWidth={2}
                dot={{ r: 4, fill: '#fdb913' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="gv-chart-card">
          <div className="gv-chart-card__title">Điểm Trung Bình Các Chủ Đề</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart
              data={TOPIC_SCORES}
              cx="50%"
              cy="50%"
              outerRadius={90}
              margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
            >
              <PolarGrid stroke="rgba(255,255,255,0.15)" />
              <PolarAngleAxis
                dataKey="topic"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickCount={4}
              />
              <Radar
                name="Điểm TB"
                dataKey="score"
                stroke="#fdb913"
                fill="#fdb913"
                fillOpacity={0.35}
                dot={{ r: 4, fill: '#fdb913' } as object}
              />
              <Tooltip {...DARK_TOOLTIP} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Progress */}
      <div className="gv-section-card">
        <div className="gv-section-card__title">Tiến Độ Các Lớp Học</div>
        <div className="gv-progress-list">
          {CLASS_PROGRESS.map((cls) => (
            <div key={cls.id} className="gv-progress-item">
              <div className="gv-progress-item__header">
                <span className="gv-progress-item__name">{cls.name}</span>
                <span className="gv-progress-item__count">
                  {cls.completed}/{cls.total} học viên hoàn thành
                </span>
              </div>
              <div className="gv-progress-bar">
                <div
                  className="gv-progress-bar__fill"
                  style={{ width: `${cls.percent}%` }}
                />
              </div>
              <span className="gv-progress-item__percent">{cls.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="gv-section-card">
        <div className="gv-section-card__title">Lịch Dạy Hôm Nay</div>
        <div className="gv-schedule-list">
          {TODAY_SESSIONS.map((session) => (
            <div key={session.id} className="gv-schedule-item">
              <span className="gv-schedule-item__time">{session.timeRange}</span>
              <div className="gv-schedule-item__info">
                <span className="gv-schedule-item__class">{session.className}</span>
                <span className="gv-schedule-item__meta">
                  {session.room} • {session.studentCount} học viên
                </span>
              </div>
              <button className="gv-schedule-item__btn">Điểm danh</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
