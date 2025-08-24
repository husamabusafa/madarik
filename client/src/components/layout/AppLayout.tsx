import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export { AppLayout };
export default AppLayout;
