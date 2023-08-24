import { connect } from 'react-redux';

import PicAdd from './PicAdd';
import { picActions, picSelectors } from '../../store/pic/picStore';

const mapStateToProps = state => ({
  isCreating: picSelectors.createItem.isPending(state),
});

const mapDispatchToProps = {
  onCreate: picActions.createRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(PicAdd);
