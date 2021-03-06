import React, { Fragment, useContext, useEffect } from "react";
import NavBar from "../../features/nav/NavBar";
import HomePage from "../../features/home/HomePage";
import ProfilePage from '../../features/profiles/ProfilePage';
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Route, Switch, RouteComponentProps, withRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "./styles.css";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import PrivateRoute from "./PrivateRoute";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import VerifyEmail from "../../features/user/VerifyEmail";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(() => {
    if (token && !appLoaded) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token, appLoaded]);

  if (!appLoaded) return <LoadingComponent content='Loading App...' />

  return (
    <Fragment>
      <ModalContainer />
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
                <PrivateRoute exact path="/activities" component={ActivityDashboard} />
                <PrivateRoute path="/activities/:id" component={ActivityDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivateRoute path='/profile/:username' component={ProfilePage} />
                <Route path='/user/registerSuccess' component={RegisterSuccess}  />
                <Route path='/user/verifyEmail' component={VerifyEmail} />
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
