import Notification from '../base/notification';

const prefixCls = 'ivu-message';
const iconPrefixCls = 'ivu-icon';
const prefixKey = 'ivu_message_key_';

const defaults = {
  top: 24,
  duration: 1.5,
};

let messageInstance;
let name = 1;

const iconTypes = {
  info: 'information-circled',
  success: 'checkmark-circled',
  warning: 'android-alert',
  error: 'close-circled',
  loading: 'load-c',
};

function getMessageInstance() {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls,
    styles: {
      top: `${defaults.top}px`,
    },
  });

  return messageInstance;
}

function notice(content = '', duration = defaults.duration, type, onClose = function () {}, closable = false) {
  const iconType = iconTypes[type];

  // if loading
  const loadCls = type === 'loading' ? ' ivu-load-loop' : '';

  const instance = getMessageInstance();

  instance.notice({
    name: `${prefixKey}${name}`,
    duration,
    styles: {},
    transitionName: 'move-up',
    content: `
      <div class="${prefixCls}-custom-content ${prefixCls}-${type}">
        <i class="${iconPrefixCls} ${iconPrefixCls}-${iconType}${loadCls}"></i>
        <span>${content}</span>
      </div>
    `,
    onClose,
    closable,
    type: 'message',
  });

  // 用于手动消除
  return (() => {
    name += 1;
    const target = name;

    return () => {
      instance.remove(`${prefixKey}${target}`);
    };
  })();
}

export default {
  name: 'Message',

  info(options) {
    return this.message('info', options);
  },
  success(options) {
    return this.message('success', options);
  },
  warning(options) {
    return this.message('warning', options);
  },
  error(options) {
    return this.message('error', options);
  },
  loading(options) {
    return this.message('loading', options);
  },
  message(type, options) {
    if (typeof options === 'string') {
      options = {
        content: options,
      };
    }
    return notice(options.content, options.duration, type, options.onClose, options.closable);
  },
  config(options) {
    if (options.top || options.top === 0) {
      defaults.top = options.top;
    }
    if (options.duration || options.duration === 0) {
      defaults.duration = options.duration;
    }
  },
  destroy() {
    const instance = getMessageInstance();
    messageInstance = null;
    instance.destroy('ivu-message');
  },
};
