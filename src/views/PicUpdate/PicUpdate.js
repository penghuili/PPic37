import { Box, Button, Text } from 'grommet';
import React, { useState } from 'react';

import ProfilePic from '../../components/ProfilePic';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import { useListener } from '../../shared/react/hooks/useListener';
import TextEditor from '../../shared/react/TextEditor';

function PicUpdate({ picId, pic, isLoading, isUpdating, isDeleting, onUpdate, onFetch, onDelete }) {
  const [note, setNote] = useState('');
  useListener(pic?.note, value => setNote(value || ''));


  useEffectOnce(() => {
    onFetch();
  });

  return (
    <>
      <AppBar title="Update friend" hasBack isLoading={isLoading || isUpdating || isDeleting} />
      <ContentWrapper>
        {!!pic && (
          <>
            <ProfilePic fileId={pic.fileId} />
            <Spacer />

            <Text weight="bold">Where are you using this profile pic?</Text>
            <TextEditor text={note} onChange={setNote} />
            <Spacer />

            <Box direction="row" justify="between" width="100%">
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

              <Button
                label="Delete"
                onClick={() => {
                  onDelete({
                    itemId: pic.sortKey,
                    pic,
                    goBack: true,
                  });
                }}
                disabled={isLoading || isDeleting}
                color="status-critical"
                primary
              />
            </Box>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default PicUpdate;
