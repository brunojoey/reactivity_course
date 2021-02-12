import React from 'react'
import { combineValidators, isRequired } from 'revalidate'
import { IProfile } from '../../app/models/profile';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { Form, Button } from 'semantic-ui-react';

const validate = combineValidators({
  displayName: isRequired('displayName')
});

interface IProps {
  editProfile: (profile: IProfile) => void;
  profile: IProfile;
};

const ProfileEditForm: React.FC<IProps> = ({editProfile, profile}) => {
  return (
    <FinalForm 
    onSubmit={editProfile}
    validate={validate}
    initialValues={profile!}
    render={({ handleSubmit, invalid, pristine, submitting }) => (
      <Form onSubmit={handleSubmit} error>
        <Field 
          name='displayName'
          component={TextInput}
          placeholder='Display Name'
          value={profile!.displayName}
        />
        <Field 
          name='bio'
          component={TextAreaInput}
          rows={3}
          placeholder='Biography'
          value={profile!.bio}
        />
        <Button
          loading={submitting}
          floated='right'
          disabled={invalid || pristine}
          positive
          content='Update Profile'
        />
      </Form>
    )}
    />
  );
};

export default observer(ProfileEditForm)
