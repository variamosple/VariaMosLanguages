import { Navigate, RouteObject } from "react-router-dom";
import { AppConfig } from "../Infraestructure/AppConfig";

import { AuthWrapper } from "@variamosple/variamos-components";
import LanguagePage from "./pages/LanguagesPage";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: (
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
