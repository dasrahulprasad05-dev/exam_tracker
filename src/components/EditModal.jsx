import { useState } from 'react';
import './Modal.css';

function EditModal({ subjectId, dayIndex, currentTopic, onSave, onClose }) {
  const [topic, setTopic] = useState(currentTopic);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSave(subjectId, dayIndex, topic.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Edit Topic</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label className="modal-label">Day {dayIndex + 1} Topic:</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="modal-textarea"
              rows={3}
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn modal-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;

