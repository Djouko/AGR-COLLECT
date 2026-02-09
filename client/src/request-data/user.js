import { shallowReactive, watchSyncEffect } from 'vue';

import { useRequestData } from './index';

export default () => {
  const { currentUser, createResource } = useRequestData();
  const user = createResource('user', () => ({
    // If the data becomes more deeply reactive, we will have to update the
    // watchSyncEffect() below.
    transformResponse: ({ data }) => shallowReactive(data)
  }));
  watchSyncEffect(() => {
    // currentUser won't have data immediately after logout.
    if (user.dataExists && currentUser.dataExists && user.id === currentUser.id)
      Object.assign(currentUser.data, user.data);
  });
  return user;
};
