import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hotel_app_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('hotel_app_registered_users');
      return savedUsers ? JSON.parse(savedUsers) : [
        {
          id: '1',
          name: 'Demo Admin',
          email: 'admin@hotel.com',
          password: 'Password@123',
          role: 'Admin',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'guest@hotel.com',
          password: 'Password@123',
          role: 'Guest',
          createdAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  // Sync registered users to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('hotel_app_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Sync currentUser session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hotel_app_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hotel_app_user');
    }
  }, [currentUser]);

  // Login handler
  const login = (email, password) => {
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (user) {
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loggedInAt: new Date().toISOString()
      };
      setCurrentUser(sessionData);
      return { success: true, message: `Welcome back, ${user.name}!` };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  // Register handler
  const register = (userData) => {
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );

    if (existing) {
      return { success: false, message: 'Email address is already registered.' };
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role || 'Guest',
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    // Automatically log in after registration
    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      loggedInAt: new Date().toISOString()
    };
    setCurrentUser(sessionData);

    return { success: true, message: 'Account created successfully!' };
  };

  // Forgot Password handler
  const forgotPassword = (email, newPassword) => {
    const userIndex = registeredUsers.findIndex(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (userIndex === -1) {
      return { success: false, message: 'No registered user found with this email address.' };
    }

    const updatedUsers = [...registeredUsers];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    setRegisteredUsers(updatedUsers);
    return { success: true, message: 'Password updated successfully! You can now log in.' };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    return { success: true, message: 'Logged out successfully.' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        forgotPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
