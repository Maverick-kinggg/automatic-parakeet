
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Drawings from './pages/Drawings';
import Categories from './pages/Categories';
import Downloads from './pages/Downloads';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'drawings', element: <Drawings /> },
      { path: 'categories', element: <Categories /> },
      { path: 'downloads', element: <Downloads /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
