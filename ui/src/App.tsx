import { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./components/Common/NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import { ToastContainer } from "react-toastify";
import { useStore } from "./store/Store";
import Spinner from "./components/Common/Spinner";
import ModalContainer from "./components/Modal/ModalContainer";

const App = () => {
    const location = useLocation();
    const { commonStore, authStore: userStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    return (
        <Fragment>
            {commonStore.appLoaded
                ? <>
                    <ModalContainer />
                    < ToastContainer position="bottom-right" hideProgressBar theme="colored" />
                    {location.pathname === "/"
                        ? <Home />
                        : <>
                            <NavBar />
                            <Container style={{ marginTop: '7em' }}>
                                <Outlet />
                            </Container>
                        </>
                    }
                </>
                : <Spinner />
            }
        </Fragment>);
};

export default observer(App);