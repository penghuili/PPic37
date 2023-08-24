import { connect } from 'react-redux';

import { picActions, picSelectors } from '../../store/pic/picStore';
import PicUpdate from './PicUpdate';

const mapStateToProps = (state, { params: { picId } }) => ({
  picId,
  pic: picSelectors.data.getItem(state, undefined, picId),
  isLoading: picSelectors.fetchItems.isPending(state),
  isUpdating: picSelectors.updateItem.isPending(state),
});

const mapDispatchToProps = {
  onFetch: picActions.fetchItemsRequested,
  onUpdate: picActions.updateRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(PicUpdate);
