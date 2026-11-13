import { useState } from 'react';
import './DailyView.css';

function DailyView({ studyPlan, onToggleDay }) {
  const [selectedDay, setSelectedDay] = useState(1);

  const dayNumbers = [];
  const maxDays = Math.max(...studyPlan.subjects.map(s => s.days.length));
  for (let i = 1; i <= maxDays; i++) dayNumbers.push(i);

  // Get all topics for selected day
  const todayTopics = studyPlan.subjects.map(subject => {
    const dayData = subject.days.find(d => d.day === selectedDay);
    return dayData ? { subject, dayData, dayIndex: subject.days.indexOf(dayData) } : null;
  }).filter(Boolean);

  const completedToday = todayTopics.filter(t => t.dayData.completed).length;
  const totalToday = todayTopics.length;
  const percentToday = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className="daily-view">
      <div className="daily-header">
        <h2>📅 Daily Study Plan</h2>
        <p className="daily-subtitle">Select a day to see all subjects' topics</p>
      </div>

      {/* Day Selector */}
      <div className="day-selector">
        {dayNumbers.map(day => (
          <button
            key={day}
            className={`day-select-btn ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day Progress */}
      <div className="daily-progress-card">
        <div className="daily-progress-info">
          <h3>Day {selectedDay} Progress</h3>
          <span className="daily-progress-count">{completedToday}/{totalToday} subjects</span>
        </div>
        <div className="daily-bar-container">
          <div className="daily-bar" style={{ width: `${percentToday}%` }}></div>
        </div>
      </div>

      {/* Topics for selected day */}
      <div className="daily-topics">
        {todayTopics.map(({ subject, dayData, dayIndex }) => (
          <div
            key={subject.id}
            className={`daily-topic-card ${dayData.completed ? 'daily-completed' : ''}`}
            style={{ '--subject-color': subject.color }}
          >
            <div
              className="daily-topic-left"
              onClick={() => onToggleDay(subject.id, dayIndex)}
            >
              <div className={`daily-check ${dayData.completed ? 'checked' : ''}`}>
                {dayData.completed ? '✓' : ''}
              </div>
            </div>
            <div className="daily-topic-content">
              <div className="daily-topic-subject">
                <span className="daily-topic-icon">{subject.icon}</span>
                {subject.name}
              </div>
              <div className="daily-topic-text">{dayData.topic}</div>
            </div>
          </div>
        ))}
      </div>

      {todayTopics.length === 0 && (
        <div className="no-topics">
          <p>No topics scheduled for Day {selectedDay}</p>
        </div>
      )}
    </div>
  );
}

export default DailyView;

