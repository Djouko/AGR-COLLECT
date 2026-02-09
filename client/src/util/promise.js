// copied from central-backend
// eslint-disable-next-line import/prefer-default-export
export const runSequentially = async (functions) => {
  const results = [];

  for (const fn of functions) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await fn());
  }

  return results;
};
