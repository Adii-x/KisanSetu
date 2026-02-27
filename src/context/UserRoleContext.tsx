import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'farmer' | 'buyer';

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isFarmer: boolean;
  isBuyer: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('smartkrishi-role');
    return (saved === 'farmer' || saved === 'buyer') ? saved : 'buyer';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('smartkrishi-role', newRole);
  };

  useEffect(() => {
    localStorage.setItem('smartkrishi-role', role);
  }, [role]);

  return (
    <UserRoleContext.Provider value={{ role, setRole, isFarmer: role === 'farmer', isBuyer: role === 'buyer' }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) throw new Error('useUserRole must be used within UserRoleProvider');
  return context;
};
