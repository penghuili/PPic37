import { Image, Spinner, Text } from 'grommet';
import React, { useEffect } from 'react';

function PicAdd({ fileId, file, isFetching, onFetch }) {
  useEffect(() => {
    onFetch({ fileId });
  }, [fileId, onFetch]);

  if (isFetching) {
    return <Spinner />;
  }

  if (!file) {
    return <Text>Profile pic is not found.</Text>;
  }

  return <Image src={file.url} alt={file.fileName} width="200px" />;
}

export default PicAdd;
