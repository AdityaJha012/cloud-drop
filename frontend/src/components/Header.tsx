import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300">
          CloudDrop
        </h1>
      </div>
      <div className="flex space-x-4">
        <ThemeToggle />
        <button 
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
