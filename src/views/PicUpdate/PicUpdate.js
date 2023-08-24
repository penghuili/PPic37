import { Button, Text } from 'grommet';
import React, { useState } from 'react';

import ProfilePic from '../../components/ProfilePic';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { useListener } from '../../shared/react/hooks/useListener';
import TextEditor from '../../shared/react/TextEditor';

function PicUpdate({ picId, pic, isLoading, isUpdating, onUpdate, onFetch }) {
  const [note, setNote] = useState('');
  useListener(pic?.note, value => setNote(value || ''));

  useEffectOnce(() => {
    onFetch();
  });

  return (
    <>
      <AppBar title="Update friend" hasBack isLoading={isLoading || isUpdating} />
      <ContentWrapper>
        {!!pic && (
          <>
            <ProfilePic fileId={pic.fileId} />
            <Spacer />

            <Text weight="bold">Where are you using this profile pic?</Text>
            <TextEditor text={note} onChange={setNote} />
            <Spacer />

            <Button
              label="Update profile pic"
              onClick={() => {
                onUpdate({
                  itemId: picId,
                  note,
                  goBack: true,
                });
              }}
              disabled={isLoading || isUpdating}
            />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default PicUpdate;
