import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-indigo-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Your Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Add dashboard widgets or sections here */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Study Progress</h2>
          {/* Add progress visualization here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
          {/* Add recent quizzes list here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;