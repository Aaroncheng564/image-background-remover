'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的登录状态
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // 加载 Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // 初始化 Google Identity Services
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '1024747233980-560unb1goh7tiilpj24laq5tg54lv3c3.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          context: 'use',
        });
      }
    };

    return () => {
      // 清理
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    // 解码 JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const userData: User = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  // 渲染登录按钮
  useEffect(() => {
    const authButton = document.getElementById('auth-button');
    if (authButton && !loading) {
      if (user) {
        authButton.innerHTML = `
          <div class="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all">
            <img src="${user.picture}" alt="${user.name}" class="w-8 h-8 rounded-full" />
            <span class="text-sm font-medium text-gray-700">${user.name}</span>
            <button id="signout-btn" class="text-gray-500 hover:text-gray-700 text-sm">退出</button>
          </div>
        `;
        document.getElementById('signout-btn')?.addEventListener('click', signOut);
      } else {
        authButton.innerHTML = `
          <button id="google-login-btn" class="flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 font-medium px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all">
            <svg viewBox="0 0 24 24" class="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google 登录</span>
          </button>
        `;
        document.getElementById('google-login-btn')?.addEventListener('click', signIn);
      }
    }
  }, [user, loading, signIn, signOut]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 添加全局类型声明
declare global {
  interface Window {
    google: any;
  }
}
