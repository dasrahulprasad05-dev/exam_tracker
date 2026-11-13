import './Dashboard.css';

function Dashboard({ studyPlan, onOpenSubject, onAddSubject, onOpenDaily, onResetDefault }) {
  const totalDays = studyPlan.subjects.reduce((sum, s) => sum + s.days.length, 0);
  const completedDays = studyPlan.subjects.reduce(
    (sum, s) => sum + s.days.filter(d => d.completed).length, 0
  );
  const overallPercent = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  // Calculate current study day based on lowest un-completed across subjects
  const getCurrentDay = () => {
    let maxCompleted = 0;
    studyPlan.subjects.forEach(s => {
      const done = s.days.filter(d => d.completed).length;
      if (done > maxCompleted) maxCompleted = done;
    });
    return Math.min(maxCompleted + 1, 20);
  };

  const currentDay = getCurrentDay();

  return (
    <div className="dashboard">
      {/* Overall Progress Card */}
      <div className="overall-card">
        <div className="overall-left">
          <h2>Overall Progress</h2>
          <p className="overall-stats">
            <span className="stat-number">{completedDays}</span>
            <span className="stat-separator">/</span>
            <span className="stat-total">{totalDays}</span>
            <span className="stat-label">topics completed</span>
          </p>
          <div className="overall-bar-container">
            <div className="overall-bar" style={{ width: `${overallPercent}%` }}></div>
          </div>
          <p className="overall-percent">{overallPercent}% Complete</p>
        </div>
        <div className="overall-right">
          <div className="big-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="circle-bg" />
              <circle
                cx="60" cy="60" r="52"
                className="circle-progress"
                style={{
                  strokeDasharray: `${2 * Math.PI * 52}`,
                  strokeDashoffset: `${2 * Math.PI * 52 * (1 - overallPercent / 100)}`
                }}
              />
            </svg>
            <div className="big-circle-text">
              <span className="big-percent">{overallPercent}%</span>
            </div>
          </div>
          <p className="current-day-badge">📅 Day {currentDay} of 20</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn action-daily" onClick={onOpenDaily}>
          📅 Today's Plan
        </button>
        <button className="action-btn action-add" onClick={onAddSubject}>
          ➕ Add Subject
        </button>
        <button className="action-btn action-reset" onClick={onResetDefault}>
          🔄 Reset Plan
        </button>
      </div>

      {/* Subject Cards */}
      <h2 className="section-title">📚 Subjects</h2>
      <div className="subjects-grid">
        {studyPlan.subjects.map(subject => {
          const completed = subject.days.filter(d => d.completed).length;
          const total = subject.days.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={subject.id}
              className="subject-card"
              onClick={() => onOpenSubject(subject)}
              style={{ '--subject-color': subject.color }}
            >
              <div className="subject-card-header">
                <span className="subject-icon">{subject.icon}</span>
                <span className="subject-percent">{percent}%</span>
              </div>
              <h3 className="subject-name">{subject.name}</h3>
              <p className="subject-progress-text">{completed}/{total} days</p>
              <div className="subject-bar-container">
                <div className="subject-bar" style={{ width: `${percent}%` }}></div>
              </div>
              {/* Mini day circles */}
              <div className="mini-circles">
                {subject.days.map((day, i) => (
                  <div
                    key={i}
                    className={`mini-circle ${day.completed ? 'completed' : ''}`}
                    title={`Day ${day.day}: ${day.topic}`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;

