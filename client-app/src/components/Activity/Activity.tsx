import { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../common/NavBar";
import ActivityList from "./List/ActivityList";

const Activity = () => {
    return (
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <ActivityList />
            </Container>
        </Fragment>
    );
}

export default Activity;