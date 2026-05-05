import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';

const statCards = [
  { key: 'totalTasks', label: 'Total Tasks', color: 'bg-indigo-500' },
  { key: 'todo', label: 'To Do', color: 'bg-yellow-500' },
  { key: 'inProgress', label: 'In Progress', color: 'bg-blue-500' },
  { key: 'done', label: 'Completed', color: 'bg-green-500' },
  { key: 'overdue', label: 'Overdue', color: 'bg-red-500' },
  { key: 'totalProjects', label: 'Projects', color: 'bg-purple-500' },
];

const statusBadge = {
  todo: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const priorityBadge = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-gray-100 text-gray-600',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/dashboard');
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your tasks and projects</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-8 h-8 ${card.color} rounded-lg mb-3 flex items-center justify-center`}>
              <span className="text-white text-sm font-bold">{data?.stats?.[card.key] || 0}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{data?.stats?.[card.key] || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Overdue Tasks
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.overdueTasks?.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">No overdue tasks</p>
            ) : (
              data?.overdueTasks?.map((task) => (
                <div key={task._id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {task.project?.name} &middot; Due{' '}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Active Tasks</h2>
            <Link to="/tasks" className="text-xs text-indigo-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recentTasks?.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">No active tasks</p>
            ) : (
              data?.recentTasks?.map((task) => (
                <div key={task._id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {task.project?.name}
                        {task.assignee && ` \u00b7 ${task.assignee.name}`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
