import { useState, useEffect, useCallback } from 'react';
import defaultStudyPlan from './data/studyPlan';
import Dashboard from './components/Dashboard';
import SubjectView from './components/SubjectView';
import EditModal from './components/EditModal';
import AddSubjectModal from './components/AddSubjectModal';
import DailyView from './components/DailyView';
import ConfirmModal from './components/ConfirmModal';
import './App.css';

const STORAGE_KEY = 'odisha_police_exam_tracker';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return defaultStudyPlan;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

function App() {
  const [studyPlan, setStudyPlan] = useState(loadData);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveData(studyPlan);
  }, [studyPlan]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const toggleDay = useCallback((subjectId, dayIndex) => {
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      const subject = newPlan.subjects.find(s => s.id === subjectId);
      if (subject && subject.days[dayIndex]) {
        subject.days[dayIndex].completed = !subject.days[dayIndex].completed;
        const wasCompleted = subject.days[dayIndex].completed;
        showToast(
          wasCompleted
            ? `✅ Day ${dayIndex + 1} completed!`
            : `⬜ Day ${dayIndex + 1} unmarked`
        );
      }
      return newPlan;
    });
  }, [showToast]);

  const editTopic = useCallback((subjectId, dayIndex, newTopic) => {
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      const subject = newPlan.subjects.find(s => s.id === subjectId);
      if (subject && subject.days[dayIndex]) {
        subject.days[dayIndex].topic = newTopic;
      }
      return newPlan;
    });
    setEditModal(null);
    showToast('📝 Topic updated!');
  }, [showToast]);

  const deleteDay = useCallback((subjectId, dayIndex) => {
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      const subject = newPlan.subjects.find(s => s.id === subjectId);
      if (subject) {
        subject.days.splice(dayIndex, 1);
        subject.days.forEach((d, i) => d.day = i + 1);
      }
      return newPlan;
    });
    showToast('🗑️ Day removed!');
  }, [showToast]);

  const addDay = useCallback((subjectId, topic) => {
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      const subject = newPlan.subjects.find(s => s.id === subjectId);
      if (subject) {
        subject.days.push({
          day: subject.days.length + 1,
          topic,
          completed: false
        });
      }
      return newPlan;
    });
    showToast('➕ New day added!');
  }, [showToast]);

  const deleteSubject = useCallback((subjectId) => {
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      newPlan.subjects = newPlan.subjects.filter(s => s.id !== subjectId);
      return newPlan;
    });
    setCurrentView('dashboard');
    setSelectedSubject(null);
    showToast('🗑️ Subject deleted!');
  }, [showToast]);

  const addSubject = useCallback((name, icon, color) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      newPlan.subjects.push({
        id,
        name,
        icon,
        color,
        days: [{ day: 1, topic: 'Day 1 topic - click to edit', completed: false }]
      });
      return newPlan;
    });
    setAddSubjectModal(false);
    showToast('📚 New subject added!');
  }, [showToast]);

  const resetAllProgress = useCallback(() => {
    setStudyPlan(prev => {
      const newPlan = JSON.parse(JSON.stringify(prev));
      newPlan.subjects.forEach(subject => {
        subject.days.forEach(day => {
          day.completed = false;
        });
      });
      return newPlan;
    });
    showToast('🔄 All progress reset!');
  }, [showToast]);

  const resetToDefault = useCallback(() => {
    setStudyPlan(defaultStudyPlan);
    setCurrentView('dashboard');
    setSelectedSubject(null);
    showToast('🔄 Reset to default plan!');
  }, [showToast]);

  const openSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('subject');
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSubject(null);
  };

  const openDailyView = () => {
    setCurrentView('daily');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            {currentView !== 'dashboard' && (
              <button className="back-btn" onClick={goToDashboard}>
                ← Back
              </button>
            )}
            <div className="logo-area">
              <div className="logo-badge">🛡️</div>
              <div>
                <h1 className="app-title">Odisha Police Exam</h1>
                <p className="app-subtitle">20-Day Study Tracker</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className={`nav-btn ${currentView === 'daily' ? 'active' : ''}`}
              onClick={openDailyView}
              title="Today's Plan"
            >
              📅
            </button>
            <button
              className="nav-btn"
              onClick={() => setConfirmModal({
                title: 'Reset Progress',
                message: 'This will unmark all completed days. Are you sure?',
                onConfirm: () => { resetAllProgress(); setConfirmModal(null); }
              })}
              title="Reset Progress"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard
            studyPlan={studyPlan}
            onOpenSubject={openSubject}
            onAddSubject={() => setAddSubjectModal(true)}
            onOpenDaily={openDailyView}
            onResetDefault={() => setConfirmModal({
              title: 'Reset to Default',
              message: 'This will restore the original study plan and remove all changes. Are you sure?',
              onConfirm: () => { resetToDefault(); setConfirmModal(null); }
            })}
          />
        )}

        {currentView === 'subject' && selectedSubject && (
          <SubjectView
            subject={studyPlan.subjects.find(s => s.id === selectedSubject.id)}
            onToggleDay={toggleDay}
            onEditTopic={(dayIndex) => {
              const subject = studyPlan.subjects.find(s => s.id === selectedSubject.id);
              setEditModal({
                subjectId: selectedSubject.id,
                dayIndex,
                currentTopic: subject.days[dayIndex].topic
              });
            }}
            onDeleteDay={(dayIndex) => setConfirmModal({
              title: 'Delete Day',
              message: `Remove Day ${dayIndex + 1} from ${selectedSubject.name}?`,
              onConfirm: () => { deleteDay(selectedSubject.id, dayIndex); setConfirmModal(null); }
            })}
            onAddDay={(topic) => addDay(selectedSubject.id, topic)}
            onDeleteSubject={() => setConfirmModal({
              title: 'Delete Subject',
              message: `Delete "${selectedSubject.name}" and all its days? This cannot be undone.`,
              onConfirm: () => { deleteSubject(selectedSubject.id); setConfirmModal(null); },
              danger: true
            })}
          />
        )}

        {currentView === 'daily' && (
          <DailyView
            studyPlan={studyPlan}
            onToggleDay={toggleDay}
          />
        )}
      </main>

      {/* Modals */}
      {editModal && (
        <EditModal
          subjectId={editModal.subjectId}
          dayIndex={editModal.dayIndex}
          currentTopic={editModal.currentTopic}
          onSave={editTopic}
          onClose={() => setEditModal(null)}
        />
      )}

      {addSubjectModal && (
        <AddSubjectModal
          onAdd={addSubject}
          onClose={() => setAddSubjectModal(false)}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
          danger={confirmModal.danger}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
