// @flow

import KSTOView from './radio'
// import WeeklyMovieView from './movie'
import WebcamsView from './webcams'
import StreamView from './stream'

export default [
  {
    id: 'KSTORadioView',
    title: 'KSTO',
    rnVectorIcon: {iconName: 'radio'},
    component: KSTOView,
  },
  // {
  //   id: 'WeeklyMovieView',
  //   title: 'Weekly Movie',
  //   rnVectorIcon: {iconName: 'film'},
  //   component: WeeklyMovieView,
  // },
  {
    id: 'LiveWebcamsView',
    title: 'Webcams',
    rnVectorIcon: {iconName: 'videocam'},
    component: WebcamsView,
  },
  {
    id: 'stream',
    title: 'Stream',
    rnVectorIcon: {iconName: 'film'},
    component: StreamView,
  },
]
