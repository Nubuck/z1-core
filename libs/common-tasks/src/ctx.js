
export const VIEW_STATUS = {
  WAITING: 'waiting',
  LOADING: 'loading',
  READY: 'ready',
  SUCCESS: 'success',
  FAIL: 'fail',
}

export const PATHS = {
  ACTION_LOCATION: [
    'meta',
    'location',
    'current',
  ],
  ACTION_LOCATION_PATHNAME: [
    'meta',
    'location',
    'current',
    'pathname',
  ],
  ACTION_DATA: [
    'payload',
    'data',
  ],
  ACTION_LIST: [
    'payload',
    'list',
  ],
  ACTION_ERROR: [
    'payload',
    'error',
  ],
  ACTION_MESSAGE: [
    'payload',
    'message',
  ],
}