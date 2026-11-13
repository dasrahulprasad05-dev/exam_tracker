import { useState } from 'react';
import './SubjectView.css';

function SubjectView({ subject, onToggleDay, onEditTopic, onDeleteDay, onAddDay, onDeleteSubject }) {
  const [newTopic, setNewTopic] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!subject) return null;

  const completed = subject.days.filter(d => d.completed).length;
  const total = subject.days.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAddDay = (e) => {
    e.preventDefault();
    if (newTopic.trim()) {
      onAddDay(newTopic.trim());
      setNewTopic('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="subject-view" style={{ '--subject-color': subject.color }}>
      {/* Subject Header */}
      <div className="subject-header">
        <div className="subject-header-top">
          <span className="subject-view-icon">{subject.icon}</span>
          <h2 className="subject-view-name">{subject.name}</h2>
        </div>
        <div className="subject-header-stats">
          <div className="subject-header-progress">
            <div className="progress-ring-container">
              <svg viewBox="0 0 80 80" className="progress-ring">
                <circle cx="40" cy="40" r="34" className="ring-bg" />
                <circle
                  cx="40" cy="40" r="34"
                  className="ring-progress"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 34}`,
                    strokeDashoffset: `${2 * Math.PI * 34 * (1 - percent / 100)}`
                  }}
                />
              </svg>
              <span className="ring-text">{percent}%</span>
            </div>
            <div className="progress-details">
              <span className="progress-count">{completed}/{total}</span>
              <span className="progress-label">Days Completed</span>
            </div>
          </div>
          <button className="delete-subject-btn" onClick={onDeleteSubject}>
            🗑️ Delete Subject
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="days-list">
        {subject.days.map((day, index) => (
          <div key={index} className={`day-card ${day.completed ? 'day-completed' : ''}`}>
            <div className="day-left" onClick={() => onToggleDay(subject.id, index)}>
              <div className={`day-circle ${day.completed ? 'checked' : ''}`}>
                {day.completed ? '✓' : day.day}
              </div>
            </div>
            <div className="day-content">
              <div className="day-number">Day {day.day}</div>
              <div className="day-topic">{day.topic}</div>
            </div>
            <div className="day-actions">
              <button
                className="day-action-btn edit-btn"
                onClick={() => onEditTopic(index)}
                title="Edit topic"
              >
                ✏️
              </button>
              <button
                className="day-action-btn delete-btn"
                onClick={() => onDeleteDay(index)}
                title="Delete day"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Day Form */}
      {showAddForm ? (
        <form className="add-day-form" onSubmit={handleAddDay}>
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Enter topic for new day..."
            className="add-day-input"
            autoFocus
          />
          <div className="add-day-btns">
            <button type="submit" className="add-day-save">Add Day</button>
            <button type="button" className="add-day-cancel" onClick={() => { setShowAddForm(false); setNewTopic(''); }}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-day-btn" onClick={() => setShowAddForm(true)}>
          ➕ Add New Day
        </button>
      )}
    </div>
  );
}

export default SubjectView;

