import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '../common/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AuthModal from '../auth/AuthModal';
import { BookOpen, Loader2, Moon, ShoppingCart, Sun, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoutMutation } from '@/hooks/queries/auth.queries';
import { useMyCart } from '@/hooks/queries/cart.queries';
import CartDropdown from './CartDropdown';
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultAuthTab, setDefaultAuthTab] = useState<'login' | 'signup'>(
    'login'
  );
  const { data: cartData } = useMyCart();
  const cartItemCount = cartData?.items?.length || 0;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      setAuthModalOpen(false);
      window.location.href = '/';
    },
  });
  const { userData } = useAuth();
  // Check if dark mode is enabled
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Icons.logo className="h-8 w-8 text-brand-500" />
              <span className="text-xl font-bold text-brand-600">
                3TEduTech
              </span>
            </Link>

            <nav className="hidden ml-10 space-x-8 md:flex">
              <Link
                to="/courses"
                className={`text-base font-medium ${
                  location.pathname === '/courses'
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-brand-500 dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Courses
              </Link>
              <Link
                to="/categories"
                className={`text-base font-medium ${
                  location.pathname === '/categories'
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-brand-500 dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Categories
              </Link>
              <Link
                to="/instructors"
                className={`text-base font-medium ${
                  location.pathname === '/instructors'
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-brand-500 dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Instructors
              </Link>
              <Link
                to="/about"
                className={`text-base font-medium ${
                  location.pathname === '/about'
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-brand-500 dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {/* Search bar and user actions */}

          <div className="hidden md:flex items-center space-x-4">
            {userData && (
              <div className="hidden md:flex items-center space-x-4">
                <NotificationDropdown />
              </div>
            )}
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10 w-[200px] lg:w-[300px]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {/* Cart Dropdown */}
            {userData && <CartDropdown />}{' '}
            {/* <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button> */}
            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="User"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.fullName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userData?.role === 'SA' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {(userData?.role === 'GV' || userData?.role === 'SA') && (
                    <DropdownMenuItem asChild>
                      <Link to="/instructor">Instructor Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/my-courses">My Courses</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/user/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/certificates">Certificates</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDefaultAuthTab('login');
                    setAuthModalOpen(true);
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => {
                    setDefaultAuthTab('signup');
                    setAuthModalOpen(true);
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon">
              <Icons.menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={defaultAuthTab}
      />
    </header>
  );
};

export default Navbar;
