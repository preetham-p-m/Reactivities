import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../../store/Store";

const RequireAuth = () => {
    const { authStore: { isLoggedIn } } = useStore();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to={"/"} state={{ from: location }} />;
    }

    return (<Outlet />);
};

export default RequireAuth;