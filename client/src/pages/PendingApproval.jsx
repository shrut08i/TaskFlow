import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-amber-600">&#9203;</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
            <p className="text-gray-500 text-sm mb-2">
              Hi <span className="font-medium text-gray-700">{user?.name}</span>, your account has been created successfully.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              An admin needs to activate your account before you can access projects and tasks. Please check back later.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <footer className="py-4 text-center">
        <p className="text-sm text-gray-400">
          Developed with <span className="text-red-500">&hearts;</span> by{' '}
          <a href="https://github.com/shrut08i" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline">
            Shruti
          </a>
        </p>
      </footer>
    </div>
  );
}
