import { useState } from "react";
import { usePomodoroTaskStore } from "../../services/pomodoroTaskStore";
import { Check, Edit3, Plus, Settings, Trash2, ChevronLeft, ChevronRight, ListTodo, CheckCircle, Clock, Calendar } from "lucide-react";
import styled from "styled-components";

const TodoSectionContainer = styled.div`
  width: 65vw;
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
  position: relative;
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
    color: var(--color);
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
`;

const ListNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: color-mix(in srgb, var(--color) 40%, transparent);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s;
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    opacity: 1;
    color: color-mix(in srgb, var(--color) 70%, transparent);
    box-shadow:
      2px 2px 4px color-mix(in srgb, var(--background-color) 89%, #000000),
      -2px -2px 4px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }
`;

const CurrentListTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: var(--color);
  text-align: center;
  font-weight: 600;
  min-width: 200px;
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
  color: var(--color);
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
  max-height: 300px;
  padding-bottom: 35px; /* Space for status bar */
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
  color: var(--color);
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
  color: var(--color);
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
    color: var(--color);
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

const StatusBar = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--background-color);
  border-radius: 0 0 0 13px;
  box-shadow:
    inset 2px 2px 4px color-mix(in srgb, var(--background-color) 92%, #000000),
    inset -2px -2px 4px color-mix(in srgb, var(--background-color) 98%, #fff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--color) 75%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--color) 15%, transparent);
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressBar = styled.div<{progress:any}>`
  width: 60px;
  height: 4px;
  background: color-mix(in srgb, var(--color) 20%, transparent);
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress || 0}%;
    background: var(--success-color);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const TodoSection = () => {
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
  const [newTaskTime, setNewTaskTime] = useState<number | undefined>(undefined);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const currentList = todoLists.find((list) => list.id === currentListId);
  const currentIndex = todoLists.findIndex((list) => list.id === currentListId);
  
  // Get previous and next lists for navigation
  const getPreviousList = () => {
    if (currentIndex > 0) {
      return todoLists[currentIndex - 1];
    }
    return null;
  };

  const getNextList = () => {
    if (currentIndex < todoLists.length - 1) {
      return todoLists[currentIndex + 1];
    }
    return null;
  };

  const previousList = getPreviousList();
  const nextList = getNextList();

  // Calculate statistics for status bar
  const getListStats = () => {
    if (!currentList) return { total: 0, completed: 0, pending: 0, totalTime: 0, completedTime: 0 };
    
    const total = currentList.tasks.length;
    const completed = currentList.tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const totalTime = currentList.tasks.reduce((sum, task) => sum + (task.timeToFinish || 0), 0);
    const completedTime = currentList.tasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + (task.timeToFinish || 0), 0);
    
    return { total, completed, pending, totalTime, completedTime };
  };

  const stats = getListStats();
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

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

  const handleEditTask = (taskId:any, currentText: string) => {
    setEditingTask(taskId);
    setEditTaskText(currentText);
  };

  const handleSaveEdit = (taskId:any) => {
    if (editTaskText.trim() && currentListId) {
      updateTask(currentListId, taskId, { text: editTaskText.trim() });
      setEditingTask(null);
      setEditTaskText("");
    }
  };

  const formatTime = (minutes:number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const navigateToList = (listId:any) => {
    setCurrentList(listId);
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
          <ListNavigation>
            <NavButton
              onClick={() => navigateToList(previousList?.id)}
              disabled={!previousList}
            >
              <ChevronLeft size={16} />
              {previousList?.name || ""}
            </NavButton>

            <CurrentListTitle>{currentList.name}</CurrentListTitle>

            <NavButton
              onClick={() => navigateToList(nextList?.id)}
              disabled={!nextList}
            >
              {nextList?.name || ""}
              <ChevronRight size={16} />
            </NavButton>
          </ListNavigation>

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

      {currentList && (
        <StatusBar>
          <StatusGroup>
            <StatusItem>
              <ListTodo />
              {stats.total} tasks
            </StatusItem>
            <StatusItem>
              <CheckCircle />
              {stats.completed} done
            </StatusItem>
            <ProgressBar progress={completionRate} />
          </StatusGroup>

          <StatusGroup>
            {stats.totalTime > 0 && (
              <StatusItem>
                <Clock />
                {formatTime(stats.totalTime)} total
              </StatusItem>
            )}
            <StatusItem>
              <Calendar />
              {Math.round(completionRate)}% complete
            </StatusItem>
          </StatusGroup>
        </StatusBar>
      )}
    </TodoSectionContainer>
  );
};

export default TodoSection;