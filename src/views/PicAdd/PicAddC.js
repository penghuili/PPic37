import { connect } from 'react-redux';

import PicAdd from './PicAdd';
import { picActions, picSelectors } from '../../store/pic/picStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';

const mapStateToProps = state => ({
  isCreating: picSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onCreate: picActions.createRequested,
  onToast: sharedActionCreators.setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(PicAdd);
