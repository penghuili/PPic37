import { Text } from 'grommet';
import React from 'react';
import { useLocation } from 'wouter';

import RouteLink from '../shared/react/RouteLink';

function Pitch({ showHome }) {
  const [location] = useLocation();

  return (
    <>
      <Text margin="0 0 1rem">
        Know how often something happens, <RouteLink label="encrypted" to="/encryption" />.
      </Text>
      {showHome && location !== '/' && <RouteLink label="← Bck to home" to="/" />}
    </>
  );
}

export default Pitch;
