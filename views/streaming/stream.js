// @flow
/**
 * All About Olaf
 * Streaming Media page
 */

import React from 'react'
import {View, Platform, ScrollView} from 'react-native'

import LoadingView from '../components/loading'
import {NoticeView} from '../components/notice'
import {ListRow, ListSeparator, Detail, Title} from '../components/list'
import {Column} from '../components/layout'
import {getTrimmedTextWithSpaces, parseHtml} from '../../lib/html'
import {parseXml} from '../news/parse-feed'

let base = 'https://www.stolaf.edu/multimedia/streams/rss/'
let streams = 'rss.cfm?'
let chapelStream = base + '/chapel-rss.cfm'
let athleticsStream = base + streams + 'category=athletics'
let academicStream = base + streams + 'category=academic'
let concertsStream = base + streams + 'category=concerts'

export default class StreamView extends React.Component {
  state = {
    loaded: false,
    refreshing: true,
    error: null,
    noStreams: false,
    streams: [],
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
        streams: result,
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
      <ScrollView contentInset={{bottom: Platform.OS === 'ios' ? 49 : 0}} >
        {this.state.streams.map((stream, i) =>
          <View key={`${i}`}>
          <ListRow
            //onPress={() => this.onPressEvent(stream)}
            arrowPosition='top'
          >
            <Column>
              <Title lines={1}>{getTrimmedTextWithSpaces(parseHtml(stream.title))}</Title>
              <Detail lines={2}>{getTrimmedTextWithSpaces(parseHtml(stream.description))}</Detail>
            </Column>
          </ListRow>
          <ListSeparator spacing={{left: 15}} />
        </View>
        )}
      </ScrollView>
    )
  }
}
