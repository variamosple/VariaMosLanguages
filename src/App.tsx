import {
  AnalyticsProvider,
  SessionProvider,
  ResponseModel,
  SessionInfoResponse,
} from "@variamosple/variamos-components";
import { FC } from "react";
import { HashRouter, useRoutes } from "react-router-dom";
import { RouterProvider } from "./core/context/RouterContext/RouterContext";
import { ROUTES } from "./core/router";
import {
  getSessionInfo,
  requestLogout,
} from "./DataProvider/Services/authService";
import { registerVisit } from "./DataProvider/Services/visitsService";
import { AppConfig } from "./Infraestructure/AppConfig";

const Routes: FC = () => {
  return useRoutes(ROUTES);
};

// Check if running in Cypress test environment
const isCypressTest = typeof window !== 'undefined' && (window as any).Cypress;

// Mock getSessionInfo for Cypress tests
const mockGetSessionInfo = async (): Promise<ResponseModel<SessionInfoResponse>> => {
  const mockResponse = new ResponseModel<SessionInfoResponse>("SUCCESS");
  mockResponse.data = {
    user: {
      id: 'guest-user',
      name: 'Guest',
      email: 'guest@example.com',
      roles: ['guest'],
      user: 'guest-user',
      permissions: []
    },
    authenticated: true,
    token: 'guest-token'
  } as SessionInfoResponse;
  return mockResponse;
};

const App: FC = () => {
  return (
    <AnalyticsProvider onVisit={registerVisit}>
      <SessionProvider
        loginUrl={AppConfig.LOGIN_URL}
        getSessionInfo={isCypressTest ? mockGetSessionInfo : getSessionInfo}
        requestLogout={requestLogout}
      >
        <HashRouter>
          <RouterProvider>
            <Routes />
          </RouterProvider>
        </HashRouter>
      </SessionProvider>
    </AnalyticsProvider>
  );
};
export default App;
