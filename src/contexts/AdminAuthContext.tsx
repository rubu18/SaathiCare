import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  loginAttempts: number;
  isLocked: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'contact@suzocoservices.in';
const ADMIN_PASSWORD = 'suzocoservices@12345'; // In production, this should be hashed and stored securely
// You should also use IP allowlisting/whitelisting on the backend. (See backend deployment and audit-logging notes.)
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

import { logAdminAudit } from "@/utils/logAdminAudit";

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  useEffect(() => {
    // Check if admin is already logged in (persist login state)
    const savedAdminEmail = localStorage.getItem('adminEmail');
    const savedLoginTime = localStorage.getItem('adminLoginTime');
    const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
    
    if (savedAdminEmail === ADMIN_EMAIL && savedLoginTime) {
      const loginTime = parseInt(savedLoginTime);
      if (Date.now() - loginTime < sessionDuration) {
        setIsAdminLoggedIn(true);
        setAdminEmail(savedAdminEmail);
      } else {
        // Session expired
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoginTime');
      }
    }

    // Check lockout status
    const savedLockoutTime = localStorage.getItem('adminLockoutTime');
    if (savedLockoutTime) {
      const lockoutTime = parseInt(savedLockoutTime);
      if (Date.now() - lockoutTime < LOCKOUT_DURATION) {
        setIsLocked(true);
        setLockoutEndTime(lockoutTime + LOCKOUT_DURATION);
      } else {
        localStorage.removeItem('adminLockoutTime');
        localStorage.removeItem('adminLoginAttempts');
        setLoginAttempts(0);
      }
    }

    // Load saved login attempts
    const savedAttempts = localStorage.getItem('adminLoginAttempts');
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }
  }, []);

  useEffect(() => {
    // Auto-unlock after lockout duration
    if (isLocked && lockoutEndTime) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLockoutEndTime(null);
        setLoginAttempts(0);
        localStorage.removeItem('adminLockoutTime');
        localStorage.removeItem('adminLoginAttempts');
      }, lockoutEndTime - Date.now());

      return () => clearTimeout(timer);
    }
  }, [isLocked, lockoutEndTime]);

  // Optionally, log all admin login attempts (see SQL migration and edge function for backend implementation)

  const loginAdmin = (email: string, password: string): boolean => {
    if (isLocked) {
      // Log locked attempt
      logAdminAudit({
        event_type: "login_attempt",
        event_result: "locked",
        admin_email: email,
        event_description: "Login attempt while account is locked.",
      });
      return false;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setAdminEmail(email);
      setLoginAttempts(0);
      const currentTime = Date.now().toString();
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminLoginTime', currentTime);
      localStorage.removeItem('adminLoginAttempts');
      localStorage.removeItem('adminLockoutTime');

      // Log successful login
      logAdminAudit({
        event_type: "login_attempt",
        event_result: "success",
        admin_email: email,
        event_description: "Successful admin login (password correct).",
      });

      return true;
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('adminLoginAttempts', newAttempts.toString());

      let event_result = "failure";
      let event_description = "Invalid credentials.";
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsLocked(true);
        const lockoutTime = Date.now();
        setLockoutEndTime(lockoutTime + LOCKOUT_DURATION);
        localStorage.setItem('adminLockoutTime', lockoutTime.toString());
        event_result = "locked";
        event_description = "Account locked due to too many failed attempts.";
      }

      // Log failed login
      logAdminAudit({
        event_type: "login_attempt",
        event_result,
        admin_email: email,
        event_description,
      });

      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLoginTime');
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        isAdminLoggedIn, 
        adminEmail, 
        loginAdmin, 
        logoutAdmin,
        loginAttempts,
        isLocked
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
