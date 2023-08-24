import { connect } from 'react-redux';

import { picActions, picSelectors } from '../../store/pic/picStore';
import Pics from './Pics';

const mapStateToProps = state => {
  return {
    pics: picSelectors.data.getItems(state),
    isLoading: picSelectors.fetchItems.isPending(state),
    isDeleting: picSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = {
  onFetch: picActions.fetchItemsRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(Pics);
