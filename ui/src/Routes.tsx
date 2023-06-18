import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ActivityDashboard from "./components/Activity/Dashboard/ActivityDashboard";
import ActivityForm from "./components/Activity/Form/ActivityForm";
import ActivityDetails from "./components/Activity/Details/ActivityDetails";
import NotFound from "./components/Errors/NotFound/Notfount";
import Errors from "./components/Errors/TestError/Errors";
import { routerPath } from "./utils/router/routerPath";
import ServerError from "./components/Errors/ServerError/ServerError";
import ProfilePage from "./components/User/ProfilePage/ProfilePage";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: `/${routerPath.ACTIVITIES}`, element: <ActivityDashboard /> },
            { path: `/${routerPath.ACTIVITIES}/${routerPath.ID}`, element: <ActivityDetails /> },
            { path: `/${routerPath.CREATE_ACTIVITY}`, element: <ActivityForm key={"create"} /> },
            { path: `/${routerPath.EDIT}/${routerPath.ID}`, element: <ActivityForm key={"edit"} /> },
            { path: `/${routerPath.TEST_ERROR}`, element: <Errors /> },
            { path: `/${routerPath.NOT_FOUND}`, element: <NotFound /> },
            { path: `/${routerPath.SERVER_ERROR}`, element: <ServerError /> },
            { path: `/${routerPath.PROFILE}/${routerPath.USER_NAME}`, element: <ProfilePage /> },
            { path: "*", element: <NotFound /> }
        ]
    }
]
export const router = createBrowserRouter(routes);