import { createBrowserRouter } from "react-router-dom";
import App from '../App.tsx';
import Dashboard from '../pages/Index/Dashboard';
const router = createBrowserRouter([  
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Dashboard,
      }
    ],
  },
]);

export default router;
