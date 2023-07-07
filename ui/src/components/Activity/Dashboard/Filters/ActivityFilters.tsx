import { Header, Menu } from "semantic-ui-react";
import Calendar from "react-calendar";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../store/Store";

const ActivityFilters = () => {
  const { activityStore: { predicate, setPredicate } } = useStore();

  return (
    <>
      <Menu vertical size="large" style={{ width: '100%', marginTop: 25 }}>
        <Header icon="filter" attached color="teal" content="Filters" />
        <Menu.Item
          content="All Activities"
          active={predicate.get("all")}
          onClick={() => setPredicate("all", "true")}
        />
        <Menu.Item
          content="I'm going"
          active={predicate.get("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}
        />
        <Menu.Item
          content="I'm hosting"
          active={predicate.get("isHost")}
          onClick={() => setPredicate("isHost", "true")}
        />
      </Menu>
      <Calendar
        onChange={(date) => setPredicate("startDate", date as Date)}
        value={predicate.get("startDate") || new Date()}
      />
    </>
  );
};

export default observer(ActivityFilters);