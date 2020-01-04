const createCustomTimeout = (fn, delay) => {
  let timeout = setTimeout(fn, delay);
  return () => clearTimeout(timeout);
};
module.exports  = createCustomTimeout;