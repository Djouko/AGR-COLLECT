import { always } from 'ramda';
import { noop } from './util';

export const rejectOnAbort = (signal, reject) => {
  if (signal.aborted) {
    reject(new Error('aborted'));
    return noop;
  }

  const listener = () => {
    reject(new Error('aborted'));
    signal.removeEventListener('abort', listener);
  };
  signal.addEventListener('abort', listener);
  return () => { signal.removeEventListener('abort', listener); };
};

export const mockSignal = always({
  aborted: false,
  addEventListener: noop,
  removeEventListener: noop
});
