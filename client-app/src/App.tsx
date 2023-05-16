import { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./components/common/NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";

const App = () => {
    const location = useLocation();
    return (
        <Fragment>
            {location.pathname === "/"
                ? <Home />
                : <>
                    <NavBar />
                    <Container style={{ marginTop: '7em' }}>
                        <Outlet />
                    </Container>
                </>
            }
        </Fragment>);
}

export default observer(App);