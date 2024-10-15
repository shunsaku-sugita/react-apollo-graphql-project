import { createBrowserRouter } from "react-router-dom";
import { Home } from './route/Home';
import { Person } from './route/Person';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/person/:personId",
    element: <Person />,
  },
]);
