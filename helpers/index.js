const unique = () => Math.random().toString(36).substring(2, 15);
const callInLastOrder = callback => setTimeout(callback, 0);

export { unique, callInLastOrder };