import { STAT_CARDS, monthlyTrend, licenseDistribution, passRates, PIE_COLORS, recentActivities } from '../../data/dashboardData';
import { StatCardsSection } from './StatCardsSection';
import { ChartsSection } from './ChartsSection';
import { ActivitySection } from './ActivitySection';
import './index.css';

export function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard Tổng Quan</h1>
        <p>Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
      </div>

      <StatCardsSection cards={STAT_CARDS} />
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
