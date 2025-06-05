import { useState } from "react";
import { usePomodoroTaskStore } from "../../services/pomodoroTaskStore";
import { Check, Edit3, Plus, Settings, Trash2 } from "lucide-react";
import styled from "styled-components";

const TodoSectionContainer = styled.div`
  width: 70vw;
  height: 100%;
  padding: 20px;
  background: var(--background-color);
  box-shadow:
    inset 7px 7px 13px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -7px -7px 13px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  border-radius: 13px 0 0 13px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color);
  }
`;

const SettingsButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  box-shadow:
    3px 3px 5px color-mix(in srgb, var(--background-color) 89%, #000000),
    -3px -3px 5px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  transition: all 0.2s;

  &:hover {
    box-shadow:
      inset 3px 3px 5px color-mix(in srgb, var(--background-color) 89%, #000000),
      inset -3px -3px 5px
        color-mix(in srgb, var(--background-color) 97.5%, #fff);
  }
`;

const ListManagement = styled.div`
  background: var(--background-color);
  border-radius: 8px;
  padding: 15px;
  box-shadow:
    inset 3px 3px 6px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -3px -3px 6px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AddListContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
    border-radius: 6px;
    background: transparent;
    color: var(--color);
    outline: none;
  }

  button {
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ListSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: transparent;
    border: none;
    color: var(--color);
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    box-shadow:
      2px 2px 4px color-mix(in srgb, var(--background-color) 89%, #000000),
      -2px -2px 4px color-mix(in srgb, var(--background-color) 97.5%, #fff);
    transition: all 0.2s;

    &.active {
      box-shadow:
        inset 2px 2px 4px
          color-mix(in srgb, var(--background-color) 89%, #000000),
        inset -2px -2px 4px
          color-mix(in srgb, var(--background-color) 97.5%, #fff);
      color: var(--primary-color);
    }
  }
`;

const DeleteButton = styled.button`
  color: var(--danger-color) !important;
  padding: 4px !important;
`;

const CurrentList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color);
  }
`;

const AddTaskContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
    border-radius: 6px;
    background: transparent;
    color: var(--color);
    outline: none;

    &:first-child {
      flex: 1;
    }
  }
`;

const TimeInput = styled.input`
  width: 80px !important;
`;

const AddTaskButton = styled.button`
  background: var(--success-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TasksList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 350px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--background-color);
  border-radius: 8px;
  box-shadow:
    3px 3px 6px color-mix(in srgb, var(--background-color) 89%, #000000),
    -3px -3px 6px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  transition: all 0.2s;

  &.completed {
    opacity: 0.6;

    .task-text {
      text-decoration: line-through;
    }
  }
`;

const CompleteButton = styled.button`
  background: var(--success-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskText = styled.span`
  color: var(--color);
  font-size: 0.95rem;
`;

const TaskTime = styled.span`
  background: var(--warning-color);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 5px;

  button {
    background: transparent;
    border: none;
    color: var(--color);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
`;

const EditTask = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
    border-radius: 4px;
    background: transparent;
    color: var(--color);
    outline: none;
  }

  button {
    background: var(--success-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 0.8rem;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--color) 60%, transparent);
  font-style: italic;
`;

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
    <TodoSectionContainer>
      <TodoHeader>
        <h2>Todo Lists</h2>
        <SettingsButton onClick={() => setShowSettings(!showSettings)}>
          <Settings size={16} />
        </SettingsButton>
      </TodoHeader>

      {showSettings && (
        <ListManagement>
          <AddListContainer>
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
          </AddListContainer>

          <ListSelector>
            {todoLists.map((list) => (
              <ListItem key={list.id}>
                <button
                  className={currentListId === list.id ? "active" : ""}
                  onClick={() => setCurrentList(list.id)}
                >
                  {list.name} ({list.tasks.length})
                </button>
                <DeleteButton onClick={() => deleteTodoList(list.id)}>
                  <Trash2 size={14} />
                </DeleteButton>
              </ListItem>
            ))}
          </ListSelector>
        </ListManagement>
      )}

      {currentList && (
        <CurrentList>
          <h3>{currentList.name}</h3>

          <AddTaskContainer>
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <TimeInput
              type="text"
              placeholder="Time (min)"
              value={newTaskTime || ""}
              onChange={(e) =>
                setNewTaskTime(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
            <AddTaskButton onClick={handleAddTask}>
              <Plus size={16} />
            </AddTaskButton>
          </AddTaskContainer>

          <TasksList>
            {currentList.tasks.map((task) => (
              <TaskItem
                key={task.id}
                className={`${task.completed ? "completed" : ""}`}
              >
                <CompleteButton
                  onClick={() => toggleTask(currentList.id, task.id)}
                >
                  <Check size={16} />
                </CompleteButton>

                {editingTask === task.id ? (
                  <EditTask>
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
                  </EditTask>
                ) : (
                  <TaskContent>
                    <TaskText>{task.text}</TaskText>
                    {task.timeToFinish && (
                      <TaskTime>{formatTime(task.timeToFinish)}</TaskTime>
                    )}
                  </TaskContent>
                )}

                <TaskActions>
                  <button onClick={() => handleEditTask(task.id, task.text)}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteTask(currentList.id, task.id)}>
                    <Trash2 size={14} />
                  </button>
                </TaskActions>
              </TaskItem>
            ))}
          </TasksList>
        </CurrentList>
      )}

      {todoLists.length === 0 && (
        <EmptyState>
          <p>No todo lists yet. Create your first list to get started!</p>
        </EmptyState>
      )}
    </TodoSectionContainer>
  );
};

export default TodoSection;
