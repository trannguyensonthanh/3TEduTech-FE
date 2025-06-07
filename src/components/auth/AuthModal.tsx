// src/components/auth/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Thêm DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Icons } from '../common/Icons'; // Giả sử có Icons.logo
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const { toast } = useToast();
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, isOpen]); // Reset tab khi modal mở hoặc defaultTab thay đổi

  const titles = {
    login: {
      title: 'Welcome Back!',
      description: 'Sign in to continue your learning journey.',
    },
    signup: {
      title: 'Create Your Account',
      description: 'Join our community and start learning today.',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl dark:bg-slate-900"
        // Bỏ hiệu ứng scale mặc định của DialogContent nếu dùng Framer Motion
        // asChild // Nếu dùng motion.div trực tiếp làm content
      >
        <AnimatePresence>
          {isOpen && ( // Chỉ animate khi isOpen
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-b dark:border-slate-700/80">
                <Link to="/" className="inline-block mx-auto mb-3">
                  <Icons.logo className="h-10 w-10 text-primary" />
                </Link>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {titles[activeTab].title}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground pt-1">
                  {titles[activeTab].description}
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 sm:p-8">
                <Tabs
                  value={activeTab} // Kiểm soát tab bằng state
                  onValueChange={(value) =>
                    setActiveTab(value as 'login' | 'signup')
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <TabsTrigger
                      value="login"
                      className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md h-full"
                    >
                      Log In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md h-full"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab} // Key để trigger animation khi tab thay đổi
                      initial={{
                        opacity: 0,
                        x:
                          activeTab === defaultTab
                            ? 0
                            : activeTab === 'login'
                            ? -20
                            : 20,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      {activeTab === 'login' && (
                        <TabsContent value="login" forceMount className="!mt-0">
                          <LoginForm onSuccess={onClose} />
                        </TabsContent>
                      )}
                      {activeTab === 'signup' && (
                        <TabsContent
                          value="signup"
                          forceMount
                          className="!mt-0"
                        >
                          <SignupForm
                            onSuccess={() => {
                              // Sau khi đăng ký thành công, có thể chuyển sang tab login và hiển thị toast
                              toast({
                                title: 'Registration Successful!',
                                description:
                                  'Please log in with your new account.',
                              });
                              setActiveTab('login');
                            }}
                          />
                        </TabsContent>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
