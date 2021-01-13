import { Fragment } from "react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { Container } from "semantic-ui-react";
import "./styles.css";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      {/* This path is for redirecting to a page that is anything other than the home page. To Render the home page outside the navbar */}
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

// the app now serves as an observer of the activity store
// withRouter gives the location prop access to the APP
export default withRouter(observer(App));
