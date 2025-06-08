import { useState } from "react";
import { usePomodoroTaskStore } from "../../services/pomodoroTaskStore";
import {
  Check,
  Edit3,
  Plus,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const TodoSectionContainer = styled.div`
  width: 60vw;
  height: 100vh;
  padding: 1.25rem;
  background: var(--background-color);
  box-shadow:
    inset 7px 7px 13px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -7px -7px 13px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  border-radius: 13px 0 0 13px;
  display: flex;
  flex-direction: column;
  gap: 0.94rem;
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
  padding: 0.5rem;
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
  padding: 0.94rem;
  box-shadow:
    inset 3px 3px 6px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -3px -3px 6px color-mix(in srgb, var(--background-color) 97.5%, #fff);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const AddListContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
    padding: 0.5rem 0.75rem;
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
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ListSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    background: transparent;
    border: none;
    color: var(--color);
    cursor: pointer;
    padding: 0.375rem 0.625rem;
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
  padding: 0.25rem !important;
`;

const CurrentList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.94rem;
`;

const ListNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.94rem;
  margin-bottom: 0.625rem;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: color-mix(in srgb, var(--color) 40%, transparent);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s;
  opacity: 0.6;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 23.3vw;
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
  min-width: 31.2vw;
`;

const AddTaskContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    padding: 0.5rem 0.75rem;
    border: 1px solid color-mix(in srgb, var(--color) 30%, transparent);
    border-radius: 6px;
    background: transparent;
    color: var(--color);
    outline: none;
    font-size: 0.95rem;
    &:first-child {
      flex: 1;
    }
  }
`;

const TimeInput = styled.input`
  width: 3.5rem !important;
`;

const AddTaskButton = styled.button`
  background: var(--success-color);
  color: var(--color);
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
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
  gap: 0.5rem;
  max-height: 40vh;
  padding-bottom: 2.2rem; /* Space for status bar */
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
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
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1000000000000;
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskText = styled.span`
  color: var(--color);
  font-size: 1rem;
`;

const TaskTime = styled.span`
  background: var(--color);
  color: var(--background-color);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.32rem;

  button {
    background: transparent;
    border: none;
    color: var(--color);
    cursor: pointer;
    padding: 0.25rem;
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
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
    padding: 0.375rem 0.625rem;
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
    padding: 0.375rem 0.625rem;
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
  bottom: 2.5rem;
  left: 0;
  right: 0;
  height: 1.5rem;
  background: var(--background-color);
  border-radius: 0 0 0 13px;
  box-shadow:
    inset 2px 2px 4px color-mix(in srgb, var(--background-color) 92%, #000000),
    inset -2px -2px 4px color-mix(in srgb, var(--background-color) 98%, #fff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.94rem;
  font-size: 0.76rem;
  color: color-mix(in srgb, var(--color) 75%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--color) 15%, transparent);
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProgressBar = styled.div<{ progress: any }>`
  width: 5rem;
  height: 0.4rem;
  background: color-mix(in srgb, var(--color) 20%, transparent);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props) => props.progress || 0}%;
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

  const { t } = useTranslation();

  const [newListName, setNewListName] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState<number | undefined>(undefined);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const currentList = todoLists.find((list) => list.id === currentListId);
  const currentIndex = todoLists.findIndex((list) => list.id === currentListId);

  const getPreviousList = () => {
    if (currentIndex > 0) return todoLists[currentIndex - 1];
    return null;
  };

  const getNextList = () => {
    if (currentIndex < todoLists.length - 1) return todoLists[currentIndex + 1];
    return null;
  };

  const previousList = getPreviousList();
  const nextList = getNextList();

  const getListStats = () => {
    if (!currentList)
      return {
        total: 0,
        completed: 0,
        pending: 0,
        totalTime: 0,
        completedTime: 0,
      };

    const total = currentList.tasks.length;
    const completed = currentList.tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const totalTime = currentList.tasks.reduce(
      (sum, task) => sum + (task.timeToFinish || 0),
      0,
    );
    const completedTime = currentList.tasks
      .filter((task) => task.completed)
      .reduce((sum, task) => sum + (task.timeToFinish || 0), 0);

    return { total, completed, pending, totalTime, completedTime };
  };

  const stats = getListStats();
  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

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

  const handleEditTask = (taskId: any, currentText: string) => {
    setEditingTask(taskId);
    setEditTaskText(currentText);
  };

  const handleSaveEdit = (taskId: any) => {
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

  const navigateToList = (listId: any) => {
    setCurrentList(listId);
  };

  return (
    <TodoSectionContainer>
      <TodoHeader>
        <h2>{t("Todo Lists")}</h2>
        <SettingsButton onClick={() => setShowSettings(!showSettings)}>
          <Settings size={16} />
        </SettingsButton>
      </TodoHeader>

      {showSettings && (
        <ListManagement>
          <AddListContainer>
            <input
              type="text"
              placeholder={t("New list name...")}
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
              placeholder={t("Add new task...")}
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <TimeInput
              type="text"
              placeholder={t("Time")}
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
                      {t("Save")}
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
          <p>
            {t("No todo lists yet. Create your first list to get started!")}
          </p>
        </EmptyState>
      )}

      {currentList && (
        <StatusBar>
          <StatusGroup>
            <StatusItem>
              <ListTodo />
              {stats.total} {t("tasks")}
            </StatusItem>
            <StatusItem>
              <CheckCircle />
              {stats.completed} {t("done")}
            </StatusItem>
            <ProgressBar progress={completionRate} />
          </StatusGroup>

          <StatusGroup>
            {stats.totalTime > 0 && (
              <StatusItem>
                <Clock />
                {formatTime(stats.totalTime)} {t("total")}
              </StatusItem>
            )}
            <StatusItem>
              <Calendar />
              {Math.round(completionRate)}% {t("complete")}
            </StatusItem>
          </StatusGroup>
        </StatusBar>
      )}
    </TodoSectionContainer>
  );
};

export default TodoSection;
