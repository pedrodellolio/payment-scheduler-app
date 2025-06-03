import { LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getUserFullName = () => {
    return user?.firstName + " " + user?.lastName;
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Payment Scheduler
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg border border-gray-300 hover:border-teal-600 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full border-2 border-teal-600 flex items-center justify-center bg-teal-50">
              <span className="text-sm font-semibold text-teal-600">
                {user?.firstName?.slice(0, 1).toUpperCase()}
              </span>
            </div>

            <span className="text-sm font-medium text-gray-900 hidden sm:block">
              {user?.firstName}
            </span>

            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 min-w-48 bg-white border border-gray-300 rounded-lg shadow-sm z-50">
              <div className="px-4 py-3 border-b border-gray-300">
                <p className="text-sm font-medium text-gray-900">
                  {getUserFullName()}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
