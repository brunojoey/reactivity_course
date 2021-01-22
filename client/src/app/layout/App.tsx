import { Fragment } from "react";
import NavBar from "../../features/nav/NavBar";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Route, Switch, RouteComponentProps, withRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "./styles.css";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <ToastContainer position='bottom-right'/>
      <Route exact path="/" component={HomePage} />
      {/* This path is for redirecting to a page that is anything other than the home page. To Render the home page outside the navbar */}
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route component={NotFound} />
              </Switch>
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
