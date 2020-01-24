const createCustomTimeout = (fn, delay) => {
  let isClear = false;
  let timeout = setTimeout(() => {
    fn();
    clearTimeout(timeout);
    isClear = true;

  }, delay);

  return {
    clear: () => {
      fn();
      clearTimeout(timeout);
      isClear = true;
    },
    isClear: () => {
      return isClear;
    }
  }
};
module.exports  = createCustomTimeout;