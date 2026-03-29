import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useLogin } from '@/hooks/query/useAuth';
import { useAuthStore } from '@/stores/authStore';

export function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { mutateAsync: login, isPending, error } = useLogin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-sm'>
        {/* Logo area */}
        <div className='mb-8 text-center'>
          <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm'>
            <svg
              className='h-6 w-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
              />
            </svg>
          </div>
          <h1 className='text-xl font-semibold text-gray-900'>Sign in</h1>
          <p className='mt-1 text-sm text-gray-500'>Access the file server</p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void login({ username, password }).then(() => navigate('/'));
          }}
          className='space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm'
        >
          <div>
            <label
              htmlFor='username'
              className='mb-1.5 block text-sm font-medium text-gray-700'
            >
              Username
            </label>
            <input
              id='username'
              type='text'
              autoComplete='username'
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              placeholder='Enter username'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-1.5 block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              placeholder='Enter password'
            />
          </div>

          {errorMessage && (
            <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600'>
              {errorMessage}
            </p>
          )}

          <button
            type='submit'
            disabled={isPending}
            className='flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 active:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isPending ? (
              <>
                <svg
                  className='h-4 w-4 animate-spin'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                  />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
