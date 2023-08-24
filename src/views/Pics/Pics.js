import { Anchor, Box, Text } from 'grommet';
import React from 'react';

import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import { useEffectOnce } from '../../shared/react/hooks/useEffectOnce';
import RouteLink from '../../shared/react/RouteLink';
import ProfilePic from '../../components/ProfilePic';
import TextEditor from '../../shared/react/TextEditor';
import { formatDateWeekTime } from '../../shared/js/date';

function Pics({ pics, isLoading, isDeleting, onFetch, onDelete }) {
  useEffectOnce(() => {
    onFetch();
  });

  return (
    <>
      <AppBar title="PPic37" isLoading={isLoading || isDeleting} />
      <ContentWrapper>
        <HorizontalCenter margin="0 0 1rem">
          <RouteLink to="/pics/add" label="Add profile pic" color="status-ok" margin="0 1rem 0 0" />
        </HorizontalCenter>
        <Divider />
        <Spacer />

        {!!pics?.length &&
          pics.map(pic => (
            <Box key={pic.sortKey} margin="0 0 3rem">
              <Text size="xsmall">{formatDateWeekTime(new Date(pic.createdAt))}</Text>
              <ProfilePic fileId={pic.fileId} />
              <Box direction="row">
                <RouteLink
                  to={`/pics/${pic.sortKey}/update`}
                  label="Edit"
                  color="status-ok"
                  size="small"
                  margin="0 1rem 0 0"
                />
                <Anchor
                  label="Delete"
                  color="status-critical"
                  size="small"
                  disabled={isDeleting}
                  onClick={() => {
                    onDelete({
                      itemId: pic.sortKey,
                      pic,
                    });
                  }}
                />
              </Box>
              <Spacer />
              {!!pic.note && <TextEditor editable={false} text={pic.note} />}
            </Box>
          ))}

        {!pics?.length && !isLoading && (
          <>
            <Text margin="0 0 1rem">No profile pics.</Text>
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Pics;
