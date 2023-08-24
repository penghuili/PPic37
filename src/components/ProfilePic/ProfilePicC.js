import { connect } from 'react-redux';

import PicAdd from './ProfilePic';
import { picActions, picSelectors } from '../../store/pic/picStore';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';

const mapStateToProps = (state, { fileId }) => ({
  fileId,
  isFetching: picSelectors.fetchFile.isPending(state),
  file: picSelectors.data.getFile(state, fileId),
});

const mapDispatchToProps = {
  onFetch: picActions.fetchFileRequested,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PicAdd);
