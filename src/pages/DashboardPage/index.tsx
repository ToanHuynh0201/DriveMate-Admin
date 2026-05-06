import { STAT_CARDS, monthlyTrend, licenseDistribution, passRates, PIE_COLORS, recentActivities } from '../../data/dashboardData';
import { StatCardsSection } from './StatCardsSection';
import { ChartsSection } from './ChartsSection';
import { ActivitySection } from './ActivitySection';
import './index.css';

export function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Overview Dashboard</h1>
        <p>Welcome back! Here is your system overview.</p>
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
