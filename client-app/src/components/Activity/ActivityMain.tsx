import { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../common/NavBar";
import ActivityDashboard from "./Dashboard/ActivityDashboard";
import Spinner from "../common/Spinner";
import { useStore } from "../../store/Store";
import { observer } from "mobx-react-lite";

const ActivityMain = () => {
    const { activityStore } = useStore();

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    return (
        <Fragment>
            <NavBar />
            {activityStore.loadingInitial
                ? <Spinner content="Loading app" />
                : <Container style={{ marginTop: '7em' }}>
                    <ActivityDashboard />
                </Container>
            }
        </Fragment>);
}

export default observer(ActivityMain);