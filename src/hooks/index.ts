import useCreate from './useCreate';
import useFind from './useFind';
import useGet from './useGet';
import useRemove from './useRemove';
import useUpdate from './useUpdate';
import usePatch from './usePatch';

const mainHooks = ({ dispatch, resetState, feathersClient, state }) => {
  const mainParams = {
    dispatch,
    resetState,
    feathersClient,
    state,
  };

  return {
    useCreate: useCreate(mainParams),
    useFind: useFind(mainParams),
    useGet: useGet(mainParams),
    useRemove: useRemove(mainParams),
    useUpdate: useUpdate(mainParams),
    usePatch: usePatch(mainParams),
  };
};

export default mainHooks;
