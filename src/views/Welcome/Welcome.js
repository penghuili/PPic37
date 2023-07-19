import { Anchor, Avatar, Heading } from 'grommet';
import React from 'react';

import logo from '../../assets/logo.png';
import Pitch from '../../components/Pitch';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import HorizontalCenter from '../../shared/react-pure/HorizontalCenter';
import Spacer from '../../shared/react-pure/Spacer';
import ChangeTheme from '../../shared/react/ChangeTheme';
import RouteLink from '../../shared/react/RouteLink';

function Welcome() {
  return (
    <>
      <ContentWrapper>
        <HorizontalCenter margin="2rem 0 1rem">
          <Avatar src={logo} />{' '}
          <Heading level="2" margin="0 0 0 1rem">
            Init37
          </Heading>
        </HorizontalCenter>
        <Pitch />
        <Spacer size="2rem" />

        <RouteLink to="/sign-up" label="Sign up" />
        <Spacer />
        <RouteLink to="/sign-in" label="Sign in" />

        <Spacer />
        <Divider />
        <Spacer />

        <RouteLink label="Motivation" to="/motivation" />
        <Spacer />
        <RouteLink label="How it works?" to="/how" />
        <Spacer />
        <RouteLink label="Limitations" to="/limitations" />
        <Spacer />
        <RouteLink label="How encryption works?" to="/encryption" />
        <Spacer />
        <RouteLink label="How to find selector?" to="/selector" />
        <Spacer />
        <RouteLink label="Pricing" to="/pricing" />
        <Spacer />
        <RouteLink label="Privacy" to="/privacy" />
        <Spacer />
        <RouteLink label="Terms" to="/terms" />
        <Spacer />
        <Anchor label="Contact" href="https://www.peng.kiwi/contact" target="_blank" />

        <Spacer />
        <Divider />
        <Spacer />

        <ChangeTheme />
      </ContentWrapper>
    </>
  );
}

export default Welcome;
