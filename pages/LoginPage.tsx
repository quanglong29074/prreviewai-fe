import React from 'react';
import { GitHubIcon } from '../components/icons';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = () => {
  const handleLogin = () => {
    // Redirect trực tiếp đến GitHub OAuth
    window.location.href =
      'https://github.com/login/oauth/authorize?client_id=Iv23limYtrYMTL2tSwn3&scope=user:email';
  };

  return (
    <div className="flex items-center justify-center min-h-screen page-fade-in">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-sky-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400">
            Welcome to CodeGuardian
          </h1>
          <p className="text-slate-400 mb-8">Your AI-powered code review assistant.</p>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-semibold hover:bg-slate-700 transition-colors duration-300"
          >
            <GitHubIcon className="w-5 h-5 mr-3" />
            Sign In with GitHub
          </button>

          <p className="text-xs text-slate-500 mt-6">
            By signing in, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
