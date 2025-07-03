import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Header from './Header';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard({ tasks }) {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, { low: 0, medium: 0, high: 0 });

  // Data for Completion Rate Doughnut Chart
  const completionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#4CAF50', '#FFC107'],
        hoverBackgroundColor: ['#45A049', '#FFB300'],
      },
    ],
  };

  // Data for Tasks by Priority Bar Chart
  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [tasksByPriority.low, tasksByPriority.medium, tasksByPriority.high],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const priorityOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Tasks by Priority',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      <div className="container mx-auto p-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Your Task Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">

          {/* Overall Stats */}
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Total Tasks</h2>
            <p className="text-5xl font-bold text-indigo-600">{totalTasks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Completed Tasks</h2>
            <p className="text-5xl font-bold text-green-600">{completedTasks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Pending Tasks</h2>
            <p className="text-5xl font-bold text-yellow-600">{pendingTasks}</p>
          </div>

          {/* Completion Rate Chart */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:col-span-1 lg:col-span-1 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Completion Overview</h2>
            <div className="w-2/3 h-2/3">
              <Doughnut data={completionData} />
            </div>
            <p className="text-3xl font-bold mt-4">
              Completion Rate: <span className="text-blue-600">{completionRate.toFixed(2)}%</span>
            </p>
          </div>

          {/* Tasks by Priority Chart */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:col-span-2 lg:col-span-2 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tasks by Priority</h2>
            <div className="w-full h-full p-4">
              <Bar data={priorityData} options={priorityOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 