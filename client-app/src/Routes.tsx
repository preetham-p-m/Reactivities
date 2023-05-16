import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ActivityDashboard from "./components/Activity/Dashboard/ActivityDashboard";
import ActivityForm from "./components/Activity/Form/ActivityForm";
import ActivityDetails from "./components/Activity/Details/ActivityDetails";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/activities", element: <ActivityDashboard /> },
            { path: "/activity/:id", element: <ActivityDetails /> },
            { path: "/create-activity", element: <ActivityForm key={"create"} /> },
            { path: "/activity/edit/:id", element: <ActivityForm key={"edit"} /> },
        ]
    }
]
export const router = createBrowserRouter(routes);