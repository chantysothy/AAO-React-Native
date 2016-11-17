// @flow
/**
 * All About Olaf
 * Streaming Media page
 */

import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  WebView,
  ListView,
} from 'react-native'

import LoadingView from '../components/loading'

let url = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=https://www.stolaf.edu/multimedia/streams/rss/rss.cfm'

type GoogleCalendarTimeType = {
  dateTime: string,
}
type GoogleCalendarEventType = {
  summary: string,
  start: GoogleCalendarTimeType,
  end: GoogleCalendarTimeType,
  location: string,
}

export default class StreamView extends React.Component {
  state = {
    streams: new ListView.DataSource({
      rowHasChanged: (r1: GoogleCalendarEventType, r2: GoogleCalendarEventType) => r1.summary !== r2.summary,
      sectionHeaderHasChanged: (h1: number, h2: number) => h1 !== h2,
    }),
    loaded: false,
    refreshing: true,
    error: null,
    noStreams: false,
  }

  getData = async () => {
    try {
      let result = await fetch(url).then(r => r.json())
      //result = result.responseData.feed.entries
      console.log(result)
      this.setState({streams: result.cloneWithRows(), loaded: true, refreshing: false, error: null, noStreams: false})
    } catch (error) {
      this.setState({error: error.message})
      console.error(error)
    }
  }

  componentWillMount() {
    this.getData()
  }
  // renderRow = (data: Object) => {
  //   return (
  //     <EventView
  //       style={styles.row}
  //       eventTitle={data.summary}
  //       startTime={data.startTime}
  //       endTime={data.endTime}
  //       location={data.location}
  //       isOngoing={data.isOngoing}
  //     />
  //   )
  // }
  render() {
    //if (!this.state.loaded) {
      return <LoadingView />
    //}
  }
}
