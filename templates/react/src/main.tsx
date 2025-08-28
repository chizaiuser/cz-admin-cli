import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
} from "react-router";
import '@/assets/icon/iconfont.css';
import './index.css'
import router from './router/index.ts';

const root = document.getElementById("root");

createRoot(root!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

