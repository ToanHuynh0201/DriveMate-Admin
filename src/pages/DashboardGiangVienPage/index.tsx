import { INSTRUCTOR, STAT_CARDS, WEEKLY_DATA, TOPIC_SCORES, CLASS_PROGRESS, TODAY_SESSIONS } from '../../data/dashboardGiangVienData';
import { InstructorHeader } from './InstructorHeader';
import { StatCardsSection } from './StatCardsSection';
import { ChartsSection } from './ChartsSection';
import { ClassProgressSection } from './ClassProgressSection';
import { TodayScheduleSection } from './TodayScheduleSection';
import './index.css';

export function DashboardGiangVienPage() {
  return (
    <div className="gv-dashboard">
      <InstructorHeader instructor={INSTRUCTOR} />
      <StatCardsSection cards={STAT_CARDS} />
      <ChartsSection weeklyData={WEEKLY_DATA} topicScores={TOPIC_SCORES} />
      <ClassProgressSection classes={CLASS_PROGRESS} />
      <TodayScheduleSection sessions={TODAY_SESSIONS} />
    </div>
  );
}
