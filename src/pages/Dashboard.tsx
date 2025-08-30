import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Database, FileText, GitBranch, User, ChevronRight } from 'lucide-react';

// Mock functions for demonstration - replace with actual implementations
const useAdmin = () => ({
  fetchModels: () => console.log('Fetching models...'),
  fetchUsers: () => console.log('Fetching users...'),
  fetchAssignments: () => console.log('Fetching assignments...')
});

const useAuth = () => ({
  user: { role: 'ADMIN' } // Mock user data
});

// Custom Link component with onClick navigation
const Link = ({ to, children, className }: any) => {
  const navigate = useNavigate();
  return (
    <div
      className={className}
      role="button"
      onClick={() => navigate(to)}
    >
      {children}
    </div>
  );
};

export default function Dashboard() {
  const { fetchModels, fetchUsers, fetchAssignments } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    fetchModels();
    fetchUsers();
    fetchAssignments();
  }, []);

  const dashboardItems = [
    {
      title: 'Users',
      path: '/users',
      icon: Users,
      description: 'Manage user accounts',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Models',
      path: '/models',
      icon: Database,
      description: 'View and manage models',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Assignments',
      path: '/assignments',
      icon: FileText,
      description: 'Track assignments',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Revisions',
      path: '/revisions',
      icon: GitBranch,
      description: 'Review revisions',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your workspace.</p>
        </div>

        {/* User Role Card */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 inline-block">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Role</p>
                <p className="text-xl font-semibold text-gray-800">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                {/* Card Content */}
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                      View Details
                    </span>
                    <ChevronRight className="w-4 h-4 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>

                {/* Subtle background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
