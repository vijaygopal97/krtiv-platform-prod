'use client';

const timeColors: Record<string, string> = {
  MORNING: 'from-orange-400 to-yellow-400',
  AFTERNOON: 'from-orange-500 to-red-400',
  EVENING: 'from-purple-500 to-pink-500',
};

const timeBgColors: Record<string, string> = {
  MORNING: 'bg-yellow-50 border-yellow-200',
  AFTERNOON: 'bg-orange-50 border-orange-200',
  EVENING: 'bg-purple-50 border-purple-200',
};

interface ActivityCardProps {
  activity: {
    time: string;
    title: string;
    duration: string;
    description: string;
    details: string;
    icon: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
}

export default function ActivityCard({ activity, isExpanded, onToggle, delay = 0 }: ActivityCardProps) {
  return (
    <div
      className={`group/activity relative cursor-pointer transition-all duration-300 ${isExpanded ? 'mb-2' : ''}`}
      onClick={onToggle}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
          isExpanded
            ? 'bg-white shadow-xl scale-[1.02] border-[#FF9933]'
            : `${timeBgColors[activity.time] || 'bg-gray-50'} shadow-md hover:shadow-lg hover:scale-[1.01]`
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className={`text-3xl transform transition-transform duration-300 ${isExpanded ? 'scale-110' : 'group-hover/activity:scale-110'}`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${timeColors[activity.time] || 'from-gray-400 to-gray-500'} text-white shadow-sm`}>
                    {activity.time}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {activity.duration}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover/activity:text-[#FF9933] transition-colors">
                  {activity.title}
                </h4>
                <p className={`text-sm text-gray-600 transition-all duration-300 ${isExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}>
                  {activity.description}
                </p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover/activity:translate-y-0.5'}`}>
              <svg className="w-5 h-5 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="pt-4 border-t-2 border-gray-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-maharashtra rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 mb-2 text-sm">Experience Details</h5>
                  <p className="text-gray-700 leading-relaxed text-sm">{activity.details}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {activity.description.split(',').map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-[#FF9933] text-xs font-semibold rounded-full border border-orange-200">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
