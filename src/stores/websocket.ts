import ReconnectingWebSocket from 'reconnecting-websocket';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useWsStore = defineStore('ws', () => {
  const wsInfoMap = ref<Record<string, any>>({
    default: {
      location: {
        protocol: 'ws:',
        host: window.location.hostname,
        port: '10086',
        pathname: '/ws',
        search: '?v=1' // 请求参数
      },
      protocols: [],
      options: {
        WebSocket: WebSocket, // WS
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000 + Math.random() * 4000,
        reconnectionDelayGrowFactor: 1.3,
        minUptime: 5000,
        connectionTimeout: 4000,
        maxRetries: Infinity,
        maxEnqueuedMessages: Infinity,
        startClosed: false,
        debug: false
      },
      logger: console,
      rws: null, // websocket实例
      connected: false, // 连接状态
      msgId: 1, // 发送的消息ID，递增
      jsonMsgCallbacks: {}, // 接收到消息的回调
      jsonMsgHandlers: [] // 消息处理函数列表, 这里函数参数是经过JSON.parse(event.data)处理的数据
    }
  });

  //@ts-ignore
  const wsInfo = computed(() => wsInfoMap.value['default']);

  const setLocation = ({ wsKey, location }: { wsKey: string; location: string }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (location && typeof location === 'object')
      wsInfo.location = Object.assign(wsInfo.location, location);
  };
  const setProtocols = ({ wsKey, protocols }: { wsKey: string; protocols: any }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (protocols && typeof wsInfo.options === 'object')
      wsInfo.protocols = Object.assign(wsInfo.protocols, protocols);
  };
  const setOptions = ({ wsKey, options }: { wsKey: string; options: any }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (options && typeof options === 'object')
      wsInfo.options = Object.assign(wsInfo.options, options);
  };
  const setRws = ({ wsKey, rws }: { wsKey: string; rws: any }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    wsInfo.rws = rws;
  };
  const setConnected = ({ wsKey, connected }: { wsKey: string; connected: boolean }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    wsInfo.connected = connected;
  };
  const setMsgId = ({ wsKey, msgId }: { wsKey: string; msgId: number }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    wsInfo.msgId = msgId;
  };
  const addJsonMsgCallback = ({
    wsKey,
    msgId,
    callback
  }: {
    wsKey: string;
    msgId: number;
    callback: any;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    wsInfo.jsonMsgCallbacks[msgId] = callback;
  };

  /**
   * 删除消息回调，删除前会先触发一遍
   * @param wsKey: websocket实例key, 默认用'default'
   * @param msgId: 指定要删除回调的msgId，如果不指定则删除所有的回调
   * @param trigger: 删除前是否触发，默认不会触发，触发参数是{code: 10086}
   */
  const delJsonMsgCallback = ({
    wsKey,
    msgId,
    trigger
  }: {
    wsKey: string;
    msgId: number;
    trigger: boolean;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (msgId) {
      const callbackObj = wsInfo.jsonMsgCallbacks[msgId];
      if (callbackObj) {
        if (trigger === true && callbackObj.limits !== 0) {
          callbackObj.callback({ code: 10086 });
        }
        delete wsInfo.jsonMsgCallbacks[msgId];
      }
    } else {
      for (const msgId in wsInfo.jsonMsgCallbacks) {
        const callbackObj = wsInfo.jsonMsgCallbacks[msgId];
        if (callbackObj && trigger === true && callbackObj.limits !== 0) {
          callbackObj.callback({ code: 10086 });
        }
        delete wsInfo.jsonMsgCallbacks[msgId];
      }
    }
  };
  const setJsonMsgCallback = ({
    wsKey,
    msgId,
    limits,
    finished
  }: {
    wsKey: string;
    msgId: number;
    limits: number;
    finished: boolean;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    wsInfo.jsonMsgCallbacks[msgId].limits = limits || wsInfo.jsonMsgCallbacks[msgId].limits;
    wsInfo.jsonMsgCallbacks[msgId].limits = finished || wsInfo.jsonMsgCallbacks[msgId].finished;
  };
  const callJsonMsgCallback = ({ wsKey, dict }: { wsKey: string; dict: any }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    const callbackObj = wsInfo.jsonMsgCallbacks[dict.id];
    if (callbackObj) {
      if (callbackObj.limits !== 0) {
        callbackObj.callback(dict);
        callbackObj.limits -= 1;
      }
      callbackObj.finished = true;

      if (callbackObj.limits === 0) {
        delete wsInfo.jsonMsgCallbacks[dict.id];
      }
    }
  };

  /**
   * 断开WebSocket连接，会触发并删除所有消息回调，触发参数是{code: 10086}
   * @param wsKey: websocket实例key, 默认用'default'
   * 调用
   *  1. this.$store.commit('websocket/close', { wsKey: 'default' })
   *  2. commit('websocket/close', { wsKey: 'default' }, { root: true })
   */
  const close = ({ wsKey }: { wsKey: string }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (wsInfo && wsInfo.rws) {
      wsInfo.rws.onopen = null;
      wsInfo.rws.onclose = null;
      wsInfo.rws.onerror = null;
      wsInfo.rws.onmessage = null;
      wsInfo.rws.close();
      // wsInfo.delJsonMsgCallback(null, true);
      // wsInfo.rws = null;
    }
  };

  /**
   * 重新进行WebSocket连接
   * @param wsKey: websocket实例key, 默认用'default'
   * 调用
   *  1. this.$store.commit('websocket/reconnect', { wsKey: 'default' })
   *  2. commit('websocket/reconnect', { wsKey: 'default' }, { root: true })
   */
  const reconnect = ({ wsKey }: { wsKey: string }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (wsInfo.rws) {
      wsInfo.rws.reconnect();
    }
  };

  /**
   * 发送消息命令
   * @param wsKey: websocket实例key, 默认用'default'
   * @param msgId: 消息ID，如果不指定，则使用递增ID
   * @param cmd: 命令/接口名称
   * @param data: 命令/接口参数
   * @param callback: 回调函数(dict) => {}或包含回调函数的对象{callback: (dict) => {}, limits: 1}
   *    callback: 回调函数
   *    limits: 限制回调次数，为0时不回调，为负数为不限制回调次数，默认为1
   * 调用:
   *  1. this.$store.commit('websocket/sendCmd', {cmd: 'xxxxx', data: {}, callback: (dict) => {}})
   *  2. commit('websocket/sendCmd', {cmd: 'xxxxx', data: {}, callback: (dict) => {}}, { root: true })
   */
  const sendCmd = ({
    wsKey,
    msgId,
    cmd,
    data,
    callback
  }: {
    wsKey: string;
    msgId: number;
    cmd: string;
    data: any;
    callback: any;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (!wsInfo.rws) {
      wsInfo.logger.error(`Websocket is not init`);
      return -1;
    }
    if (wsInfo.rws.readyState !== ReconnectingWebSocket.OPEN) {
      wsInfo.logger.error(`Websocket readyState is not open`);
      return -2;
    }
    const msg = {
      id: msgId || wsInfo.msgId,
      cmd: cmd,
      data: data || {}
    };
    if (msg.id === wsInfo.msgId) {
      wsInfo.msgId += 1;
      if (wsInfo.msgId > 10000) {
        wsInfo.msgId = 1;
      }
    }
    if (callback) {
      if (typeof callback === 'function') {
        wsInfo.jsonMsgCallbacks[msg.id] = {
          callback: callback,
          limits: 1,
          finished: false
        };
      } else if (typeof callback === 'object' && callback.callback) {
        if (callback.limits === undefined) {
          callback.limits = 1;
        }
        callback.finished = false;
        wsInfo.jsonMsgCallbacks[msg.id] = callback;
      }
    }
    const msgStr = JSON.stringify(msg);
    if (wsInfo.options.debug) {
      wsInfo.logger.log(`Websocket send: ${msgStr}`);
    }
    wsInfo.rws.send(msgStr);
    return msg.id;
    // wsOp.sendCmd(wsInfo, {msgId, cmd, data, callback});
  };

  /**
   * 增加Websocket事件监听器
   * @param wsKey: websocket实例key, 默认用'default'
   * @param type: 事件类型, open/close/error/message
   * @param listener: 处理方法，参数为事件event
   * 调用
   *  1. this.$store.dispatch('websocket/addEventListener', { wsKey: 'default', type: 'open', (evt) => {} })
   *  2. dispatch('websocket/addEventListener', { wsKey: 'default', type: 'open', (evt) => {} }, { root: true })
   */
  const addEventListener = ({
    wsKey,
    type,
    listener
  }: {
    wsKey: string;
    type: string;
    listener: any;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (wsInfo.rws) {
      wsInfo.rws.addEventListener(type, listener);
    }
    // wsOp.addEventListener(wsInfo, type, listener);
  };

  /**
   * 增加Websocket消息处理器
   * @param wsKey: websocket实例key, 默认用'default'
   * @param handler: 消息处理方法，参数为消息对象
   * 调用
   *  1. this.$store.commit('websocket/addJsonMsgHandler', { wsKey: 'default', (dict) => {} })
   *  2. commit('websocket/addJsonMsgHandler', { wsKey: 'default', (dict) => {} }, { root: true })
   */
  const addJsonMsgHandler = ({ wsKey, handler }: { wsKey: string; handler: any }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (!wsInfo.jsonMsgHandlers.includes(handler)) {
      wsInfo.jsonMsgHandlers.push(handler);
    }
    // wsOp.addEventListener(wsInfo, handler);
  };

  const init = ({
    wsKey,
    location,
    options
  }: {
    wsKey?: string;
    location?: any;
    options?: any;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    setLocation({ wsKey: wsKey, location: location });
    setOptions({ wsKey: wsKey, options: options });
    const url = `${wsInfo.location.protocol}//${wsInfo.location.host}${wsInfo.location.port ? ':' + wsInfo.location.port : ''}${wsInfo.location.pathname}${wsInfo.location.search}`;
    wsInfo.logger.log(`Websocket init: ${url}`);

    if (wsInfo.rws) {
      closeWs({ wsKey: wsKey });
    }
    const rws = new ReconnectingWebSocket(url, wsInfo.protocols, wsInfo.options);

    rws.onopen = function (evt) {
      setConnected({ wsKey: wsKey, connected: true });
      if (wsInfo.options.debug) {
        wsInfo.logger.log(`Websocket onopen event`);
      }
    };
    rws.onclose = function (evt) {
      setConnected({ wsKey: wsKey, connected: false });
      if (wsInfo.options.debug) {
        wsInfo.logger.log(`Websocket onclose event`);
      }
    };
    rws.onerror = function (evt) {
      setConnected({ wsKey: wsKey, connected: false });
      if (wsInfo.options.debug) {
        wsInfo.logger.log(`Websocket onerror event`);
      }
    };
    rws.onmessage = function (evt) {
      if (wsInfo.options.debug) {
        wsInfo.logger.log(`Websocket onmessage: ${evt.data}`);
      }
      const dict = JSON.parse(evt.data) || {};
      // 消息回调
      callJsonMsgCallback({ wsKey: wsKey, dict: dict });
      // 消息处理
      for (const handler of wsInfo.jsonMsgHandlers) {
        handler(dict);
      }
    };
    setRws({ wsKey: wsKey, rws: rws });
  };
  /**
   * 断开WebSocket连接，会触发并删除所有消息回调，触发参数是{code: 10086}
   * @param wsKey: websocket实例key, 默认用'default'
   * 调用
   *  1. this.$store.dispatch('websocket/close', { wsKey: 'default' })
   *  2. dispatch('websocket/close', { wsKey: 'default' }, { root: true })
   */
  const closeWs = ({ wsKey }: { wsKey: string }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (wsInfo && wsInfo.rws) {
      close({ wsKey: wsKey });
      delJsonMsgCallback({ wsKey: wsKey, msgId: null, trigger: true });
      setRws({ wsKey: wsKey, rws: null });
    }
  };

  /**
   * 重新进行WebSocket连接
   * @param wsKey: websocket实例key, 默认用'default'
   * 调用
   *  1. this.$store.dispatch('websocket/reconnect', { wsKey: 'default' })
   *  2. dispatch('websocket/reconnect', { wsKey: 'default' }, { root: true })
   */
  const reconnectWs = ({ wsKey }: { wsKey: string }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    reconnect({ wsKey: wsKey });
  };
  /**
   * 发送消息命令
   * @param wsKey: websocket实例key, 默认用'default'
   * @param msgId: 消息ID，如果不指定，则使用递增ID
   * @param cmd: 命令/接口名称
   * @param data: 命令/接口参数
   * @param callback: 回调函数(dict) => {}或包含回调函数的对象{callback: (dict) => {}, limits: 1}
   *    callback: 回调函数
   *    limits: 限制回调次数，为0时不回调，为负数为不限制回调次数，默认为1
   * 调用:
   *  1. this.$store.dispatch('websocket/sendCmd', {cmd: 'xxxxx', data: {}, callback: (dict) => {}})
   *  2. dispatch('websocket/sendCmd', {cmd: 'xxxxx', data: {}, callback: (dict) => {}}, { root: true })
   */
  const sendCmdWs = ({
    wsKey,
    msgId,
    cmd,
    data,
    callback
  }: {
    wsKey: string;
    msgId: number;
    cmd: string;
    data: any;
    callback: any;
  }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (!wsInfo.rws) {
      wsInfo.logger.error(`Websocket is not init`);
      return -1;
    }
    if (wsInfo.rws.readyState !== ReconnectingWebSocket.OPEN) {
      wsInfo.logger.error(`Websocket readyState is not open`);
      return -2;
    }
    const msg = {
      id: msgId || wsInfo.msgId,
      cmd: cmd,
      data: data || {}
    };
    if (msg.id === wsInfo.msgId) {
      setMsgId({ wsKey: wsKey, msgId: wsInfo.msgId + 1 });
      if (wsInfo.msgId > 10000) {
        setMsgId({ wsKey: wsKey, msgId: 1 });
      }
    }
    if (callback) {
      if (typeof callback === 'function') {
        addJsonMsgCallback({
          wsKey: wsKey,
          msgId: msg.id,
          callback: {
            callback: callback,
            limits: 1,
            finished: false
          }
        });
      } else if (typeof callback === 'object' && callback.callback) {
        if (callback.limits === undefined) {
          callback.limits = 1;
        }
        callback.finished = false;
        addJsonMsgCallback({ wsKey: wsKey, msgId: msg.id, callback: callback });
      }
    }
    const msgStr = JSON.stringify(msg);
    if (wsInfo.options.debug) {
      wsInfo.logger.log(`Websocket send: ${msgStr}`);
    }
    wsInfo.rws.send(msgStr);
    return msg.id;
  };
  return { wsInfoMap, wsInfo, init };
});
