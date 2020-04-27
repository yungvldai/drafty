function warn(text) {
  console.warn('[Drafty] ' + text);
}

function error(text) {
  console.error('[Drafty] ' + text);
}

function info(text) {
  console.log('[Drafty] ' + text);
}

export default {
  warn, error, info
};