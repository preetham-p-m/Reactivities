import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ActivityDashboard from "./components/Activity/Dashboard/ActivityDashboard";
import ActivityForm from "./components/Activity/Form/ActivityForm";
import ActivityDetails from "./components/Activity/Details/ActivityDetails";
import NotFound from "./components/Errors/NotFound/Notfount";
import Errors from "./components/Errors/TestError/Errors";
import { RouterPath } from "./@types/RouterPath";
import ServerError from "./components/Errors/ServerError/ServerError";
import Login from "./components/Users/Login/Login";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: `/${RouterPath.ACTIVITIES}`, element: <ActivityDashboard /> },
            { path: `/${RouterPath.ACTIVITIES}/${RouterPath.ID}`, element: <ActivityDetails /> },
            { path: `/${RouterPath.CREATE_ACTIVITY}`, element: <ActivityForm key={"create"} /> },
            { path: `/${RouterPath.EDIT}/${RouterPath.ID}`, element: <ActivityForm key={"edit"} /> },
            { path: `/${RouterPath.TEST_ERROR}`, element: <Errors /> },
            { path: `/${RouterPath.NOT_FOUND}`, element: <NotFound /> },
            { path: `/${RouterPath.SERVER_ERROR}`, element: <ServerError /> },
            { path: "*", element: <NotFound /> }
        ]
    }
]
export const router = createBrowserRouter(routes);