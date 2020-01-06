const createCustomTimeout = (fn, delay) => {
  let isClear = false;
  let timeout = setTimeout(fn, delay);

  return {
    clear: () => {
      clearTimeout(timeout);
      isClear = true;
    },
    isClear: () => isClear
  }
};
module.exports  = createCustomTimeout;