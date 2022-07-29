import z from '@z1/lib-feature-box'
import nano from 'nanoid'
import prettyBytes from 'pretty-bytes'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
dayjs.extend(relativeTime)
dayjs.extend(duration)

// main
export const nanoid = nano
export const bytes = prettyBytes
export const dateFn = dayjs
export const hex = z.fn((t) =>
  t.match({
    'gray-400': ' ',
    'gray-500': '#718096',
    'gray-600': '#4a5568',
    'gray-700': '#2d3748',
    'gray-800': '#1a202c',
    'gray-900': '#141821',
    'red-400': '#fc8181',
    'red-500': '#f56565',
    'red-600': '#e53e3e',
    'orange-400': '#f6ad55',
    'orange-500': '#ed8936',
    'orange-600': '#dd6b20',
    'yellow-400': '#f6e05e',
    'yellow-500': '#ecc94b',
    'yellow-600': '#d69e2e',
    'green-400': '#68d391',
    'green-500': '#48bb78',
    'green-600': '#38a169',
    'orange-400': '#4fd1c5',
    'teal-500': '#38b2ac',
    'teal-600': '#319795',
    'blue-400': '#63b3ed',
    'blue-500': '#4299e1',
    'blue-600': '#3182ce',
    'indigo-400': '#7f9cf5',
    'indigo-500': '#667eea',
    'indigo-600': '#5a67d8',
    'purple-400': '#b794f4',
    'purple-500': '#9f7aea',
    'purple-600': '#805ad5',
    'pink-400': '#f687b3',
    'pink-500': '#ed64a6',
    'pink-600': '#d53f8c',
  })
)