import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Header, Tab, Card, Image, Button, Grid } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/photoUpload/PhotoUploadWidget";
import { RootStoreContext } from "../../app/stores/rootStore";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    deletePhoto,
    loading,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(true);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  // This will cancel the upload widget when it is successful
  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)} // To have toggle functionality
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          onClick={(event) => {
                            setMainPhoto(photo);
                            setTarget(event.currentTarget.name);
                          }}
                          disabled={photo.isMain}
                          loading={loading && target === photo.id}
                          basic
                          positive
                          content="Main"
                        />
                        <Button
                          basic
                          negative
                          icon="trash"
                          name={photo.id}
                          disabled={photo.isMain}
                          onClick={(event) => {
                            deletePhoto(photo);
                            setDeleteTarget(event.currentTarget.name)
                          }}
                          loading={loading && deleteTarget === photo.id}
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
