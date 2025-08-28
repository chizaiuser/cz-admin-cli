import React, { createContext, useEffect, useState } from 'react';
import { menuQueryMenu } from '../../api/member/role';
const defaultAuthList: string[] = JSON.parse(localStorage.getItem('authList') || '[]');

export const AuthContext = createContext<{ authList: any[] }>({ authList: defaultAuthList });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authList, setAuthList] = useState<any[]>([]);

  useEffect(() => {
    menuQueryMenu().then(res => {
      const list = res.data || [];
      setAuthList(list);
      localStorage.setItem('authList', JSON.stringify(list)); // 如需本地缓存可保留
    });
  }, []);
  return (
    <AuthContext.Provider value={{ authList }}>
      {children}
    </AuthContext.Provider>
  );
};