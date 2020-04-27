import log from '../log';

function isBlockUseStyle(block, registered) {
  let found = registered.find(x => x.type === block.type);
  if (found && found.options.useStyle) return true;
  return false;
}

function separateMarkup(string) {
  let mlbeg = ['<', '&'];
  let mlend = ['>', ';'];
  let phrases = [
    { type: 'text', content: '', index: 0 }
  ];
  let totalIndex = 1;
  for (let i = 0; i < string.length; ++i) {
    if (mlbeg.includes(string[i])) {
      phrases.push({
        type: 'markup',
        content: string[i],
        index: totalIndex
      });
      totalIndex += 1;
      continue;
    }
    if (mlend.includes(string[i])) {
      phrases[phrases.length - 1].content += string[i];
      phrases.push({
        type: 'text',
        content: '',
        index: totalIndex
      });
      totalIndex += 1;
      continue;
    }
    phrases[phrases.length - 1].content += string[i];
  }
  return phrases.filter(x => x.content);
}

function glueMarkup(array) {
  return array.sort((a, b) => {
    if (a.index > b.index) {
      return 1;
    }
    if (a.index < b.index) {
      return -1;
    }
    return 0;
  }).map(x => x.content).join('');
}

const openTag = (tag, attrs) => {
  let attrsString = '';
  for (let attr in attrs) {
    attrsString += `${attr}="${this.attrs[attr]}"`;
  }
  return `<${tag}${attrsString ? ' ' : ''}${attrsString}>`;
}

const closeTag = tag => {
  return `</${tag}>`;
}

function applyTag(_rangeCopy, tag, workArray) {
  let i = 0, rangeCopy = _rangeCopy;
  while(rangeCopy - workArray[i].content.length > 0) {
    rangeCopy -= workArray[i].content.length;
    i += 1;
  }
  let newContent = workArray[i].content;
  workArray[i].content = 
    newContent.substr(0, rangeCopy) + 
    tag + 
    newContent.substr(rangeCopy, newContent.length);
};

function applyStyle(target, style) {
  let _t = target, rollback = target;
  try {
    [openTag(style.tag, style.attrs), closeTag(style.tag)].forEach((tag, index) => {
      let separated = separateMarkup(_t);
      let textOnly = separated.filter(x => x.type === 'text');
      let markup = separated.filter(x => x.type === 'markup');
      applyTag(style.range[index], tag, textOnly);
      _t = glueMarkup([ ...textOnly, ...markup ]);
    });
    return _t;
  } catch (e) {
    log.error('Style object binded to non-existent range!');
    return rollback;
  }
}

function addStyle(block, style) {
  let registered = block['editor-only'].$drafty.registered;
  if (!isBlockUseStyle(block, registered)) {
    block['editor-only'].$drafty.log.warn('Block cannot be styled!');
    return;
  }
  block.data.style.push(style);
}

export default {
  applyStyle, addStyle
};