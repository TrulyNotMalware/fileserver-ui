import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { FileBrowserPage } from '@/pages/FileBrowserPage';
import { LoginPage } from '@/pages/LoginPage';

export function Router() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route
        path='/*'
        element={
          <ProtectedRoute>
            <FileBrowserPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
