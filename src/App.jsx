import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./LandingPage";
import FeaturesPage from "./FeaturesPage";
import MainApp from "./MainApp";
import Dashboard from "./Dashboard";

// This is a no-op comment to force Vite to re-evaluate imports

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskImage, setNewTaskImage] = useState("");
  const [newTaskReminder, setNewTaskReminder] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [onScreenNotification, setOnScreenNotification] = useState(null);


  const fetchTasks = useCallback(async (currentToken) => {
    if (!currentToken) return;
    const response = await fetch(
      "https://todobackend-bi77.onrender.com/tasks",
      {
        headers: { Authorization: `Bearer ${currentToken}` },
      }
    );
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  }, [setTasks]);

  useEffect(() => {
    fetchTasks(token);
  }, [token, fetchTasks]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text, image, reminder, priority) => {
    const response = await fetch(
      "https://todobackend-bi77.onrender.com/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, status: "pending", priority, image, reminder }),
      }
    );
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    if (reminder) {
      scheduleReminder(newTask.text, reminder, priority);
    }
    setNewTaskText("");
    setNewTaskImage("");
    setNewTaskReminder("");
    setNewTaskPriority("medium");
    setShowAddTaskPopup(false);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await fetch(`https://todobackend-bi77.onrender.com/tasks/${taskToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskToDelete._id));
      setTaskToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
    setShowDeleteConfirm(false);
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
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
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
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
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus === "all" || task.status === filterStatus) &&
      (filterPriority === "all" || task.priority === filterPriority)
  );

  const scheduleReminder = (taskText, reminderTime, taskPriority) => {
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
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? (
            <MainApp
              token={token}
              setToken={setToken}
              tasks={tasks}
              setTasks={setTasks}
              fetchTasks={fetchTasks}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              newTaskText={newTaskText}
              setNewTaskText={setNewTaskText}
              newTaskImage={newTaskImage}
              setNewTaskImage={setNewTaskImage}
              newTaskReminder={newTaskReminder}
              setNewTaskReminder={setNewTaskReminder}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              showAddTaskPopup={showAddTaskPopup}
              setShowAddTaskPopup={setShowAddTaskPopup}
              taskToDelete={taskToDelete}
              setTaskToDelete={setTaskToDelete}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              onScreenNotification={onScreenNotification}
              setOnScreenNotification={setOnScreenNotification}
              logout={logout}
              addTask={addTask}
              handleDeleteClick={handleDeleteClick}
              confirmDelete={confirmDelete}
              cancelDelete={cancelDelete}
              updateTaskStatus={updateTaskStatus}
              updateTaskPriority={updateTaskPriority}
              filteredTasks={filteredTasks}
              scheduleReminder={scheduleReminder}
            />
          ) : (
            <LandingPage setToken={setToken} />
          )}
        />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/dashboard" element={token ? <Dashboard tasks={tasks} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
