import { Anchor, Spinner, Text } from 'grommet';
import React from 'react';

import apps from '../../shared/js/apps';
import { formatDateTime } from '../../shared/js/date';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Divider from '../../shared/react-pure/Divider';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import AppVersion from '../../shared/react/AppVersion';
import ChangeTheme from '../../shared/react/ChangeTheme';
import PaymentStatus from '../../shared/react/PaymentStatus';
import RouteLink from '../../shared/react/RouteLink';

function Home({ account, isLoadingAccount }) {
  return (
    <>
      <AppBar title="Account" hasBack />
      <ContentWrapper>
        {isLoadingAccount && <Spinner />}
        {!!account?.userId && (
          <>
            <Text margin="0 0 1rem">Username: {account.username}</Text>
            <Text margin="0 0 1rem">User ID: {account.userId}</Text>
            <Text margin="0 0 1rem">Created at: {formatDateTime(account.createdAt)}</Text>
            <PaymentStatus app={apps.watcher37.name} showBuyButton />
            <Divider />
            <Spacer />
            {!!account.telegramId && (
              <Text margin="0 0 1rem">
                Telegram ID: <RouteLink to="/account/telegram" label={account.telegramId} />
              </Text>
            )}
            <ChangeTheme />
            <Divider />
            <Spacer />
            <RouteLink label="Security" to="/security" />
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
            <RouteLink label="Buy tickets" to="/tickets" />
            <Spacer />
            <RouteLink label="Privacy" to="/privacy" />
            <Spacer />
            <RouteLink label="Terms" to="/terms" />
            <Spacer />
            <Anchor label="Contact" href="https://www.peng.kiwi/contact" target="_blank" />
            <Spacer />
            <Divider />
            <Spacer />
            <AppVersion />
          </>
        )}
      </ContentWrapper>
    </>
  );
}

export default Home;
