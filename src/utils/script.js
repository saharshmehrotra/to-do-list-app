// Utility functions for logging To-Do List actions

// Log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

// Function to format the current timestamp
const getFormattedTimestamp = () => {
  return new Date().toLocaleString();
};

// Main logging function
const log = (level, message, data = {}) => {
  const logEntry = {
    timestamp: getFormattedTimestamp(),
    level,
    message,
    data
  };

  // Log to console with appropriate styling
  const consoleStyles = {
    [LOG_LEVELS.INFO]: 'color: #4CAF50',
    [LOG_LEVELS.WARNING]: 'color: #FFA500',
    [LOG_LEVELS.ERROR]: 'color: #FF4444'
  };

  console.log(
    `%c[${logEntry.level}] ${logEntry.timestamp}: ${logEntry.message}`,
    consoleStyles[level] || ''
  );

  if (Object.keys(data).length > 0) {
    console.log('Additional data:', data);
  }

  // Store log in localStorage
  const logs = JSON.parse(localStorage.getItem('todoLogs') || '[]');
  logs.push(logEntry);
  localStorage.setItem('todoLogs', JSON.stringify(logs));

  return logEntry;
};

// Specific logging functions for different actions
const logTaskCreation = (taskText) => {
  return log(LOG_LEVELS.INFO, 'Task created', { taskText });
};

const logTaskCompletion = (taskText, completed) => {
  return log(
    LOG_LEVELS.INFO,
    `Task ${completed ? 'completed' : 'uncompleted'}`,
    { taskText, completed }
  );
};

const logTaskDeletion = (taskText) => {
  return log(LOG_LEVELS.INFO, 'Task deleted', { taskText });
};

const logError = (error) => {
  return log(LOG_LEVELS.ERROR, 'An error occurred', { error: error.message });
};

// Export all logging functions
export {
  logTaskCreation,
  logTaskCompletion,
  logTaskDeletion,
  logError,
  LOG_LEVELS
};