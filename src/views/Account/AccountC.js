import { connect } from 'react-redux';

import sharedSelectors from '../../shared/react/store/sharedSelectors';
import Account from './Account';

const mapStateToProps = state => ({
  account: sharedSelectors.getAccount(state),
  expiresAt: sharedSelectors.getExpiresAt(state),
  isLoadingAccount: sharedSelectors.isLoadingAccount(state),
});

const mapDispatchToProps = {
  onLogOut: sharedActionCreators.logOutPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
