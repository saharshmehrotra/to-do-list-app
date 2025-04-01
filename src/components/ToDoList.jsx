import { useState } from 'react';
import '../styles/ToDoList.css';
import { logTaskCreation, logTaskCompletion, logTaskDeletion } from '../utils/script';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);

  const addToHistory = (action, task) => {
    const historyItem = {
      id: Date.now(),
      action,
      taskText: task.text,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [historyItem, ...prev]);

    // Log the action using the logging utility
    switch (action) {
      case 'added':
        logTaskCreation(task.text);
        break;
      case 'completed':
      case 'uncompleted':
        logTaskCompletion(task.text, action === 'completed');
        break;
      case 'deleted':
        logTaskDeletion(task.text);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      addToHistory('added', newTask);
    }
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    addToHistory('deleted', taskToDelete);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        addToHistory(updatedTask.completed ? 'completed' : 'uncompleted', updatedTask);
        return updatedTask;
      }
      return task;
    }));
  };

  const groupHistoryByTask = () => {
    const grouped = {};
    history.forEach(item => {
      if (!grouped[item.taskText]) {
        grouped[item.taskText] = [];
      }
      grouped[item.taskText].push(item);
    });
    return grouped;
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a new task"
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="todo-list">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
            />
            <span>{task.text}</span>
            <span className="task-date">{task.createdAt}</span>
            <button
              className="delete-button"
              onClick={() => handleDeleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="history-container">
        <h2>Task History</h2>
        <div className="history-list">
          {Object.entries(groupHistoryByTask()).map(([taskText, items]) => (
            <div key={taskText} className="history-group">
              <h3 className="history-task-title">{taskText}</h3>
              <ul>
                {items.map(item => (
                  <li key={item.id} className="history-item">
                    <span className="history-time">{item.timestamp}</span>
                    <span className="history-text">
                      {item.action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;