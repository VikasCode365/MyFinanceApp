import React, { memo } from 'react';
import { PlusCircle } from 'lucide-react';

const GoalsTab = ({
  goals,
  newGoal,
  setNewGoal,
  showAddGoal,
  setShowAddGoal,
  handleAddGoal,
  achievements,
  isDarkMode
}) => {
  const shareAchievement = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `Achievement: ${achievement.name}`,
        text: `I earned the ${achievement.name} achievement on Monify! ${achievement.description}`,
        url: window.location.href,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      toast.info('Sharing not supported on this device. Copy the URL to share!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
        <button
          className="goals-tab bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setShowAddGoal(!showAddGoal)}
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Goal
        </button>
      </div>

      {showAddGoal && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Create New Savings Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Concert tickets, new laptop, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (₹)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Already Saved (₹)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newGoal.saved}
                onChange={(e) => setNewGoal({ ...newGoal, saved: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg mr-2"
              onClick={() => setShowAddGoal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              onClick={handleAddGoal}
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No savings goals yet. Create one to start saving!</p>
          </div>
        ) : (
          goals.map(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const remaining = goal.target - goal.saved;
            let daysRemaining = null;
            if (goal.deadline) {
              const today = new Date();
              const deadline = new Date(goal.deadline);
              const diffTime = deadline - today;
              daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{goal.name}</h3>
                  <span className="px-2 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {progress.toFixed(0)}% Complete
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Saved: ₹{goal.saved.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Target: ₹{goal.target.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Need: ₹{remaining.toFixed(2)}</p>
                    {daysRemaining !== null && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{daysRemaining} days left</p>
                    )}
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-indigo-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium px-3 py-1 border border-indigo-600 dark:border-indigo-400 rounded-lg">
                    Add Funds
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Achievements</h3>
        {achievements.map(achievement => (
          <div key={achievement.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex items-center">
              <div className="text-yellow-500 mr-3">🏆</div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description} • {achievement.date}</p>
              </div>
            </div>
            <button
              onClick={() => shareAchievement(achievement)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
            >
              Share
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(GoalsTab);