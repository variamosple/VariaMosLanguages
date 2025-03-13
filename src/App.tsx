import {
  AnalyticsProvider,
  SessionProvider,
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

const App: FC = () => {
  return (
    <AnalyticsProvider onVisit={registerVisit}>
      <SessionProvider
        loginUrl={AppConfig.LOGIN_URL}
        getSessionInfo={getSessionInfo}
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
