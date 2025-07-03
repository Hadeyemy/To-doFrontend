import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Login from "./Login";
import Signup from "./Signup";

function MainApp({
  token,
  setToken,
  tasks,
  setTasks,
  fetchTasks,
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskImage, setNewTaskImage] = useState("");
  const [newTaskReminder, setNewTaskReminder] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [onScreenNotification, setOnScreenNotification] = useState(null);

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token, fetchTasks]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text, image, reminder, duration, priority) => {
    try {
      console.log("Attempting to add task with token:", token);
      const response = await fetch(
        "https://todobackend-bi77.onrender.com/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, status: "pending", priority, image, reminder, durationMinutes: parseInt(duration) || 0 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add task:", response.status, errorData);
        alert(`Failed to add task: ${errorData.message || response.statusText}`);
        return;
      }

      fetchTasks(token);

      setNewTaskText("");
      setNewTaskImage("");
      setNewTaskReminder("");
      setNewTaskDuration("");
      setNewTaskPriority("medium");
      setShowAddTaskPopup(false);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding the task.");
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        console.log("Attempting to delete task with token:", token);
        const response = await fetch(`https://todobackend-bi77.onrender.com/tasks/${taskToDelete._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to delete task:", response.status, errorData);
          alert(`Failed to delete task: ${errorData.message || response.statusText}`);
          return;
        }

        fetchTasks(token);
        setTaskToDelete(null);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("An error occurred while deleting the task.");
      }
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
    setShowDeleteConfirm(false);
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      console.log("Attempting to update task status with token:", token);
      const response = await fetch(
        `https://todobackend-bi77.onrender.com/tasks/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update task status:", response.status, errorData);
        alert(`Failed to update task status: ${errorData.message || response.statusText}`);
        return;
      }

      fetchTasks(token);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("An error occurred while updating the task status.");
    }
  };

  const updateTaskPriority = async (id, newPriority) => {
    try {
      console.log("Attempting to update task priority with token:", token);
      const response = await fetch(
        `https://todobackend-bi77.onrender.com/tasks/${id}/priority`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update task priority:", response.status, errorData);
        alert(`Failed to update task priority: ${errorData.message || response.statusText}`);
        return;
      }

      fetchTasks(token);
    } catch (error) {
      console.error("Error updating task priority:", error);
      alert("An error occurred while updating the task priority.");
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const markTaskAsNotCompleted = (id) => {
    setTasks(tasks.map((task) =>
      task._id === id ? { ...task, isMissedReminder: true } : task
    ));
  };

  const scheduleReminder = (taskText, reminderTime, taskPriority, durationMinutes) => {
    const reminderDate = new Date(reminderTime);
    const now = new Date();

    if (reminderDate > now) {
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      setTimeout(() => {
        const voomSound = new Audio('/voom.mp3');
        voomSound.play().catch(error => console.error("Error playing sound:", error));

        if (Notification.permission === "granted") {
          new Notification("Task Reminder", {
            body: `Don\'t forget: ${taskText}`,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Task Reminder", {
                body: `Don\'t forget: ${taskText}`,
              });
            }
          });
        }

        if (taskPriority === "high") {
          setOnScreenNotification({
            message: `High Priority Reminder: Don\'t forget: ${taskText}`,
            id: Date.now(),
          });
          setTimeout(() => setOnScreenNotification(null), 5000);
        }
      }, timeUntilReminder);
    }

    if (durationMinutes > 0) {
      const taskExpirationTime = reminderDate.getTime() + (durationMinutes * 60 * 1000); // Expiration is reminder + duration
      const autoNotCompletedTime = taskExpirationTime + (160 * 60 * 1000); // 160 minutes after expiration
      const timeUntilAutoNotCompleted = autoNotCompletedTime - now.getTime();

      if (timeUntilAutoNotCompleted > 0) {
        setTimeout(() => {
          // Only mark as missed if the task is still pending and not manually marked
          setTasks(prevTasks => prevTasks.map(task => {
            if (task.text === taskText && task.status === "pending" && !task.isMissedReminder) {
              return { ...task, isMissedReminder: true };
            }
            return task;
          }));
        }, timeUntilAutoNotCompleted);
      }
    }
  };

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const closeLoginPopup = () => setShowLoginPopup(false);
  const closeSignupPopup = () => setShowSignupPopup(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      <div className="container p-4">
        {onScreenNotification && (
          <div
            key={onScreenNotification.id}
            className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-xl z-50 animate-bounce"
          >
            {onScreenNotification.message}
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">To-Do List</h1>
          <button
            onClick={() => setShowAddTaskPopup(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Task
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {showAddTaskPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl m-4 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <input
                type="text"
                className="border p-2 rounded w-full mb-2"
                placeholder="Task description"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded w-full mb-2"
                placeholder="Image URL (optional)"
                value={newTaskImage}
                onChange={(e) => setNewTaskImage(e.target.value)}
              />
              <input
                type="datetime-local"
                className="border p-2 rounded w-full mb-2"
                value={newTaskReminder}
                onChange={(e) => setNewTaskReminder(e.target.value)}
              />
              <input
                type="number"
                className="border p-2 rounded w-full mb-2"
                placeholder="Duration in minutes (optional)"
                value={newTaskDuration}
                onChange={(e) => setNewTaskDuration(e.target.value)}
              />
              <select
                className="border p-2 rounded w-full mb-4"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() =>
                    addTask(newTaskText, newTaskImage, newTaskReminder, newTaskDuration, newTaskPriority)
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTaskPopup(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl m-4 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete the task: "
                {taskToDelete ? taskToDelete.text : ""}"?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex space-x-4">
          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="border p-2 rounded"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`p-4 border rounded shadow-sm bg-white flex justify-between items-center ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              }`}
            >
              <div>
                <h3 className="font-semibold text-lg">{task.text}</h3>
                {task.image && (
                  <img
                    src={task.image}
                    alt="Task"
                    className="mt-2 max-w-xs h-auto rounded"
                  />
                )}
                {task.reminder && (
                  <p className="text-sm text-gray-600">
                    Reminder: {new Date(task.reminder).toLocaleString()}
                  </p>
                )}
                {task.durationMinutes > 0 && (
                  <p className="text-sm text-gray-600">
                    Duration: {task.durationMinutes} minutes
                  </p>
                )}
                <p
                  className={`text-sm ${
                    task.priority === "high"
                      ? "text-red-500"
                      : task.priority === "medium"
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  Priority: {task.priority}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  className={`py-1 px-3 rounded text-white ${
                    task.status === "pending"
                      ? "bg-green-500 hover:bg-green-700"
                      : "bg-yellow-500 hover:bg-yellow-700"
                  }`}
                >
                  {task.status === "pending" ? "Complete" : "Pending"}
                </button>
                {task.reminder && new Date(task.reminder) < new Date() && task.status === "pending" && !task.isMissedReminder && (
                  <button
                    onClick={() => markTaskAsNotCompleted(task._id)}
                    className={`py-1 px-3 rounded text-white bg-red-500 hover:bg-red-700`}
                  >
                    Mark Not Completed
                  </button>
                )}
                {task.isMissedReminder && <span className="text-red-500 ml-2 font-semibold"> (Automatically Marked Not Completed)</span>}
                <select
                  value={task.priority}
                  onChange={(e) => updateTaskPriority(task._id, e.target.value)}
                  className="border py-1 px-3 rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => handleDeleteClick(task)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showLoginPopup && <Login onClose={closeLoginPopup} setToken={setToken} />}
      {showSignupPopup && <Signup onClose={closeSignupPopup} onSignupSuccess={closeSignupPopup} />}
    </div>
  );
}

export default MainApp;