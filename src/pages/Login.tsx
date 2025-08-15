import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

declare global {
  interface Window {
    google: any;
  }
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [useRealOAuth, setUseRealOAuth] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Load Google OAuth script
    if (useRealOAuth) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [useRealOAuth]);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        }
      );
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    try {
      const result = await authAPI.googleAuth(response.credential);
      login(result);
      navigate(from, { replace: true });
    } catch (error: any) {
      alert(error.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      alert('กรุณากรอกอีเมลและชื่อ');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.mockGoogleAuth({ email, name });
      login(response);
      navigate(from, { replace: true });
    } catch (error: any) {
      alert(error.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <LogIn className="h-8 w-8 theme-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            เข้าสู่ระบบ NNote
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            สร้างและแชร์บันทึกของคุณ
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          {/* OAuth Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => setUseRealOAuth(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !useRealOAuth
                    ? 'btn-primary'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Demo Mode
              </button>
              <button
                type="button"
                onClick={() => setUseRealOAuth(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  useRealOAuth
                    ? 'btn-primary'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Real OAuth
              </button>
            </div>
          </div>

          {useRealOAuth ? (
            /* Real Google OAuth */
            <div className="space-y-4">
              <div
                id="google-signin-button"
                className="w-full flex justify-center"
              ></div>
              {loading && (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                ใช้ Google OAuth จริง<br />
                ต้องตั้งค่า GOOGLE_CLIENT_ID ใน environment variables
              </p>
            </div>
          ) : (
            /* Mock OAuth Form */
            <form className="space-y-6" onSubmit={handleMockGoogleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  อีเมล
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ชื่อ
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="ชื่อของคุณ"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'เข้าสู่ระบบ (Demo)'
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                โหมดทดสอบสำหรับการพัฒนา<br />
                ไม่ต้องใช้ Google account จริง
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;