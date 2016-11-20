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
  RefreshControl,
  WebView,
  ListView,
} from 'react-native'

import LoadingView from '../components/loading'
import EventView from '../calendar/event'
import * as c from '../components/colors'

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
      result = result.responseData.feed.entries
      console.log(result)
      this.setState({
        streams: this.state.streams.cloneWithRows(result),
        loaded: true,
        refreshing: false,
        error: null,
        noStreams: false,
      })
    } catch (error) {
      this.setState({error: error.message})
      console.error(error)
    }
  }

  componentWillMount() {
    this.getData()
  }
  renderRow = (data: Object) => {
    return (
      <Text>{data.title}</Text>

      // <EventView
      //   style={styles.row}
      //   eventTitle={data.summary}
      //   startTime={data.startTime}
      //   endTime={data.endTime}
      //   location={data.location}
      //   isOngoing={data.isOngoing}
      // />
    )
  }
  render() {
    if (!this.state.loaded) {
      return <LoadingView />
    }

    return (
      <ListView
        style={styles.listContainer}
        dataSource={this.state.streams}
        renderRow={this.renderRow}
        pageSize={5}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
          />
        }
      />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    backgroundColor: '#ffffff',
  },
  row: {
    paddingRight: 10,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb',
  },
  rowSectionHeader: {
    backgroundColor: c.iosListSectionHeader,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  rowSectionHeaderText: {
    color: 'black',
    fontWeight: 'bold',
  },
})

