import { Navigate, RouteObject } from "react-router-dom";
import { AppConfig } from "../Infraestructure/AppConfig";

import { AuthWrapper } from "@variamosple/variamos-components";
import LanguagePage from "./pages/LanguagesPage";

// Check if running in Cypress test environment
const isCypressTest = typeof window !== 'undefined' && (window as any).Cypress;

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: isCypressTest ? (
          <LanguagePage />
        ) : (
          <AuthWrapper redirectPath={AppConfig.LOGIN_URL}>
            <LanguagePage />
          </AuthWrapper>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
