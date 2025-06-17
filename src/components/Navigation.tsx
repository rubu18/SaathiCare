
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Users, Calendar, MessageCircle, Shield, LogIn } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Find Companions', href: '/companions', icon: Users },
    { name: 'Book Visit', href: '/book', icon: Calendar },
    { name: 'Messages', href: '/chat', icon: MessageCircle },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Hover trigger area */}
      <div 
        className="fixed left-0 top-0 w-4 h-full z-40 bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isHovered ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-64 h-full border-r bg-white shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex flex-col gap-2 p-2">
            <Link to="/" className="flex items-center space-x-2 p-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-blue-800">SaathiCare</span>
            </Link>
          </div>

          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
            {/* Navigation Group */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-gray-500 mb-2">
                Navigation
              </div>
              <div className="w-full text-sm">
                <ul className="flex w-full min-w-0 flex-col gap-1">
                  {navigation.map((item) => (
                    <li key={item.name} className="group/menu-item relative">
                      <Link
                        to={item.href}
                        className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-gray-100 ${
                          isActive(item.href) 
                            ? 'bg-gray-100 font-medium text-gray-900' 
                            : 'text-gray-700'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Account Group */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-gray-500 mb-2">
                Account
              </div>
              <div className="w-full text-sm">
                <ul className="flex w-full min-w-0 flex-col gap-1">
                  <li className="group/menu-item relative">
                    <Link
                      to="/auth"
                      className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-gray-100 ${
                        isActive('/auth') 
                          ? 'bg-gray-100 font-medium text-gray-900' 
                          : 'text-gray-700'
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Admin Group */}
            <div className="relative flex w-full min-w-0 flex-col p-2">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-gray-500 mb-2">
                Admin
              </div>
              <div className="w-full text-sm">
                <ul className="flex w-full min-w-0 flex-col gap-1">
                  <li className="group/menu-item relative">
                    <Link
                      to="/admin"
                      className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-gray-100 ${
                        isActive('/admin') 
                          ? 'bg-gray-100 font-medium text-gray-900' 
                          : 'text-red-600'
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 p-2">
            <div className="p-2 text-xs text-gray-500 text-center">
              SaathiCare Platform
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
