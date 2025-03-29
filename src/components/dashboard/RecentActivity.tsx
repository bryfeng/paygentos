import React from 'react';
import Card from '../shared/Card';

interface RecentActivityProps {
  activities: {
    id: string;
    type: 'booking' | 'expense' | 'event' | 'customer';
    title: string;
    description: string;
    timestamp: string;
    status?: 'pending' | 'completed' | 'cancelled';
  }[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '✈️';
      case 'expense':
        return '💰';
      case 'event':
        return '📅';
      case 'customer':
        return '👤';
      default:
        return '📝';
    }
  };

  return (
    <Card title="Recent Activity">
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No recent activities</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="py-3 flex items-start">
              <div className="mr-4 text-xl">{getTypeIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                {activity.status && (
                  <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;
