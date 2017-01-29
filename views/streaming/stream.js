// @flow
/**
 * All About Olaf
 * Streaming Media page
 */

import React from 'react'
import {
  StyleSheet,
  Text,
  RefreshControl,
  View,
  ListView,
} from 'react-native'

import LoadingView from '../components/loading'
import {NoticeView} from '../components/notice'
import {ListRow, ListSeparator, Detail, Title} from '../components/list'
import {Column} from '../components/layout'
import EventView from '../calendar/event'
import { getTrimmedTextWithSpaces, parseHtml } from '../../lib/html'
import {parseXml} from '../news/parse-feed'
import * as c from '../components/colors'

let base = 'https://www.stolaf.edu/multimedia/streams/rss/'
let streams = 'rss.cfm?'
let chapelStream = base + '/chapel-rss.cfm'
let athleticsStream = base + streams + 'category=athletics'
let academicStream = base + streams + 'category=academic'
let concertsStream = base + streams + 'category=concerts'

type GoogleCalendarTimeType = {
  dateTime: string,
}
type GoogleCalendarEventType = {
  summary: string,
  start: GoogleCalendarTimeType,
  end: GoogleCalendarTimeType,
  location: string,
};

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

  componentWillMount() {
    this.getData()
  }

  getData = async () => {
    try {
      const responseText = await fetch(concertsStream).then(r => r.text())
      const feed = await parseXml(responseText)
      const result = feed.rss.channel[0].item

      if (result.length < 1) {
        this.setState({noStreams: true})
      }

      this.setState({
        streams: this.state.streams.cloneWithRows(result),
        loaded: true,
        refreshing: false,
        error: null,
        noStreams: false,
      })
    } catch (error) {
      this.setState({error: error.message})
      console.warn(error)
    }
  }

  renderRow = (data: Object) => {
    let title = getTrimmedTextWithSpaces(parseHtml(data.title))
    let description = getTrimmedTextWithSpaces(parseHtml(data.description))
    return (
      <View>
        <ListRow
          onPress={() => this.onPressEvent(data)}
          arrowPosition='top'
        >
          <Column>
            <Title lines={1}>{title}</Title>
            <Detail lines={2}>{description}</Detail>
          </Column>
        </ListRow>
        <ListSeparator spacing={{left: 15}} />
      </View>

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

    if (this.state.error) {
      return <NoticeView text={'Error: ' + this.state.error.message} />
    }

    if (this.state.noStreams) {
      return <NoticeView text={'No Streams'} />
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

