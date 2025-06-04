import { useState } from "react";
import { usePomodoroTaskStore } from "../../services/pomodoroTaskStore";
import { Check, Edit3, Plus, Settings, Trash2 } from "lucide-react";
import "./TodoPomodoro.css";

const TodoSection: React.FC = () => {
  const {
    todoLists,
    currentListId,
    addTodoList,
    deleteTodoList,
    setCurrentList,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = usePomodoroTaskStore();

  const [newListName, setNewListName] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState<number | undefined>();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const currentList = todoLists.find((list) => list.id === currentListId);

  const handleAddList = () => {
    if (newListName.trim()) {
      addTodoList(newListName.trim());
      setNewListName("");
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim() && currentListId) {
      addTask(currentListId, newTaskText.trim(), newTaskTime);
      setNewTaskText("");
      setNewTaskTime(undefined);
    }
  };

  const handleEditTask = (taskId: string, currentText: string) => {
    setEditingTask(taskId);
    setEditTaskText(currentText);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editTaskText.trim() && currentListId) {
      updateTask(currentListId, taskId, { text: editTaskText.trim() });
      setEditingTask(null);
      setEditTaskText("");
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="todo-section">
      <div className="todo-header">
        <h2>Todo Lists</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="settings-btn"
        >
          <Settings size={16} />
        </button>
      </div>

      {showSettings && (
        <div className="list-management">
          <div className="add-list">
            <input
              type="text"
              placeholder="New list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddList()}
            />
            <button onClick={handleAddList}>
              <Plus size={16} />
            </button>
          </div>

          <div className="list-selector">
            {todoLists.map((list) => (
              <div key={list.id} className="list-item">
                <button
                  className={currentListId === list.id ? "active" : ""}
                  onClick={() => setCurrentList(list.id)}
                >
                  {list.name} ({list.tasks.length})
                </button>
                <button
                  onClick={() => deleteTodoList(list.id)}
                  className="delete-btn"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentList && (
        <div className="current-list">
          <h3>{currentList.name}</h3>

          <div className="add-task">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <input
              type="text"
              placeholder="Time (min)"
              value={newTaskTime || ""}
              onChange={(e) =>
                setNewTaskTime(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="time-input"
            />
            <button onClick={handleAddTask}>
              <Plus size={16} />
            </button>
          </div>

          <div className="tasks-list">
            {currentList.tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <button
                  onClick={() => toggleTask(currentList.id, task.id)}
                  className="complete-btn"
                >
                  <Check size={16} />
                </button>

                {editingTask === task.id ? (
                  <div className="edit-task">
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveEdit(task.id)
                      }
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(task.id)}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="task-content">
                    <span className="task-text">{task.text}</span>
                    {task.timeToFinish && (
                      <span className="task-time">
                        {formatTime(task.timeToFinish)}
                      </span>
                    )}
                  </div>
                )}

                <div className="task-actions">
                  <button onClick={() => handleEditTask(task.id, task.text)}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteTask(currentList.id, task.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todoLists.length === 0 && (
        <div className="empty-state">
          <p>No todo lists yet. Create your first list to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TodoSection;
