import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ActivityDetailHeader: React.FC<{activity: IActivity}> = ({ activity }) => {
  return (
    <div>
          <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
              <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
              {/* Without the basic part, the image text would have the default styling covering the image where not needed */}
              <Segment basic style={activityImageTextStyle}>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Header
                        size='huge'
                        content={activity.title}
                        style={{ color: 'white' }}
                      />
                      <p>{activity.date}</p>
                      <p>
                        Hosted by <strong>Bob</strong>
                      </p>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
              <Button color='teal'>Join Activity</Button>
              <Button>Cancel attendance</Button>
              <Button color='orange' floated='right'>
                Manage Event
              </Button>
            </Segment>
          </Segment.Group>
    </div>
  )
}

export default observer(ActivityDetailHeader)