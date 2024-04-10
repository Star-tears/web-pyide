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

  const wsInfo = computed(() => {
    return (wsKey: string) => {
      return wsInfoMap.value[wsKey || 'default'];
    };
  });

  const setLocation = ({ wsKey, location }: { wsKey: string; location: string }) => {
    const wsInfo = wsInfoMap.value[wsKey || 'default'];
    if (!wsInfo) return -1;
    if (location && typeof location === 'object')
      wsInfo.location = Object.assign(wsInfo.location, location);
  };
  return { wsInfoMap, wsInfo, setLocation };
});
