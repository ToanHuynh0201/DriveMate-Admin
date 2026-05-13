import { SectionCard } from '../../components/ui/SectionCard';
import { Avatar } from '../../components/ui/Avatar';
import type { RecentActivity } from '../../types';

interface ActivitySectionProps {
  activities: RecentActivity[];
}

export function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <SectionCard title="Hoạt Động Gần Đây" variant="dark">
      <div className="activity-list">
        {activities.map((item) => (
          <div key={item.id} className="activity-item">
            <Avatar initials={item.name.charAt(0)} size="md" />
            <div className="activity-item__info">
              <div className="activity-item__name">{item.name}</div>
              <div className="activity-item__action">{item.action}</div>
            </div>
            <div className={`activity-item__dot activity-item__dot--${item.status}`} />
            <div className="activity-item__time">{item.time}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
