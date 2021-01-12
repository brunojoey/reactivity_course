import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";
import ActivityStore from "../../app/stores/activityStore";

const NavBar: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to='/'>
          <img src="/assets/logo.png" alt="logo" style={{marginRight: '1rem'}}/>
          Reactivities
        </Menu.Item>
        <Menu.Item name="activities" as={NavLink} to='/activities' />
        <Menu.Item>
          <Button as={NavLink} to='/createActivity' positive content="Create Activity" />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);