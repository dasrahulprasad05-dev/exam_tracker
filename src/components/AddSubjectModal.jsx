import { useState } from 'react';
import './Modal.css';

const ICON_OPTIONS = ['📚', '📝', '🧠', '💻', '⚡', '🌍', '📐', '🏛️', '🔬', '📊', '🎯', '📖', '🗂️', '🔢', '🏃'];
const COLOR_OPTIONS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#ef4444', '#8b5cf6', '#f97316', '#14b8a6', '#a855f7'];

function AddSubjectModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📚');
  const [color, setColor] = useState('#6366f1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), icon, color);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Add New Subject</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label className="modal-label">Subject Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-input"
              placeholder="e.g., Current Affairs"
              autoFocus
            />

            <label className="modal-label">Choose Icon:</label>
            <div className="icon-picker">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`icon-option ${icon === opt ? 'selected' : ''}`}
                  onClick={() => setIcon(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <label className="modal-label">Choose Color:</label>
            <div className="color-picker">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`color-option ${color === opt ? 'selected' : ''}`}
                  style={{ backgroundColor: opt }}
                  onClick={() => setColor(opt)}
                />
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn modal-save" disabled={!name.trim()}>Add Subject</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubjectModal;

