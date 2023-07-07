import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./List/ActivityList";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../../store/Store";
import ActivityFilters from "./Filters/ActivityFilters";
import { PagingParams } from "../../../@types/Pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "../Placeholder/ActivityListItemPlaceholder";

const ActivityDashboard = () => {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    };

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities]);

    return (
        <><Grid>
            <Grid.Column width={10}>
                {activityStore.loadingInitial && !loadingNext
                    ? <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                    : <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>

                }
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
        </>
    );
};

export default observer(ActivityDashboard);