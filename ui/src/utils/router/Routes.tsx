import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ActivityDashboard from "../../components/Activity/Dashboard/ActivityDashboard";
import ActivityForm from "../../components/Activity/Form/ActivityForm";
import ActivityDetails from "../../components/Activity/Details/ActivityDetails";
import NotFound from "../../components/Errors/NotFound/Notfount";
import Errors from "../../components/Errors/TestError/Errors";
import { routerPath } from "./routerPath";
import ServerError from "../../components/Errors/ServerError/ServerError";
import ProfilePage from "../../components/User/ProfilePage/ProfilePage";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    { path: `/${routerPath.ACTIVITIES}`, element: <ActivityDashboard /> },
                    { path: `/${routerPath.ACTIVITIES}/${routerPath.ID}`, element: <ActivityDetails /> },
                    { path: `/${routerPath.CREATE_ACTIVITY}`, element: <ActivityForm key={"create"} /> },
                    { path: `/${routerPath.EDIT}/${routerPath.ID}`, element: <ActivityForm key={"edit"} /> },
                    { path: `/${routerPath.TEST_ERROR}`, element: <Errors /> },
                    { path: `/${routerPath.PROFILE}/${routerPath.USER_NAME}`, element: <ProfilePage /> },
                ]
            },
            { path: `/${routerPath.NOT_FOUND}`, element: <NotFound /> },
            { path: `/${routerPath.SERVER_ERROR}`, element: <ServerError /> },
            { path: "*", element: <NotFound /> }
        ]
    }
];

export const router = createBrowserRouter(routes);