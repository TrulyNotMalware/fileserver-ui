import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { useAuthStore } from '@/stores/authStore';

import { ProtectedRoute } from './ProtectedRoute';

import { render, screen } from '@testing-library/react';

afterEach(() => {
  useAuthStore.setState({
    accessToken: null,
    isAuthenticated: false,
    isHydrated: false,
  });
});

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route
          path='/private'
          element={
            <ProtectedRoute>
              <div>secret content</div>
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when unauthenticated', () => {
    renderApp();
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).toBeNull();
  });

  it('renders children when authenticated', () => {
    useAuthStore.getState().setToken('fake-token');
    renderApp();
    expect(screen.getByText('secret content')).toBeInTheDocument();
  });
});
