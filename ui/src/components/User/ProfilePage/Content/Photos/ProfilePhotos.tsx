import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { useStore } from "../../../../../store/Store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../../../MediaUpload/Photo/PhotoUploadWidget";
import { Photo } from "../../../../../@types/User";

const ProfilePhotos = () => {
    const {
        userProfileStore: { user: profile, isCurrentUser,
            uploadPhoto, uploading,
            setMainPhoto, deletePhoto, loading } }
        = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState<boolean>(false);
    const [target, setTarget] = useState("");


    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    };

    const handleSetMainPhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    };

    const handleDeletePhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    };

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="image" content="Photos" />
                    {isCurrentUser && (
                        <Button
                            floated="right"
                            basic
                            color={addPhotoMode ? "red" : "teal"}
                            content={addPhotoMode ? "Cancel" : "Add Photo"}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode
                        ? <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                        : (<Card.Group itemsPerRow={5}>
                            {profile?.photos?.map((photo) =>
                                <Card key={photo.id}>
                                    <Image src={`${photo.url}`} />
                                    {isCurrentUser && (
                                        <Button.Group widths={2}>
                                            <Button
                                                basic
                                                content={"Main"}
                                                color="green"
                                                name={"main" + photo.id}
                                                disabled={photo.isMain}
                                                loading={target === "main" + photo.id && loading}
                                                onClick={(e) => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button
                                                basic
                                                color="red"
                                                icon="trash"
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={target === photo.id && loading}
                                                onClick={e => handleDeletePhoto(photo, e)}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>)
                            }
                        </Card.Group>)}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfilePhotos);