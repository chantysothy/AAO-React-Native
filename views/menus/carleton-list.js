// @flow
import React from 'react'
import {View, Platform, ScrollView, StyleSheet} from 'react-native'
import type {TopLevelViewPropsType} from '../types'
import type {CarletonDetailMenuType} from './types'
import {Row} from '../components/layout'
import {ListRow, ListSeparator, Title} from '../components/list'
import {NoticeView} from '../components/notice'

import {carleton} from './tabs'

const styles = StyleSheet.create({
  rowText: {
    paddingVertical: 6,
  },
})

export class CarletonMenuPicker extends React.Component {
  props: TopLevelViewPropsType;

  onPressRow = (data: CarletonDetailMenuType) => {
    let name = data.title
    let id = data.props.cafeId
    let message = data.props.loadingMessage

    this.props.navigator.push({
      id: 'BonAppHostedMenu',
      title: name,
      backButtonTitle: 'Carleton',
      index: this.props.route.index + 1,
      props: {
        name: name,
        loadingMessage: message,
        cafeId: id,
      },
    })
  }

  render() {
    if (!carleton) {
      return <NoticeView text={'No Carleton Cafes to choose.'} />
    }

    return (
      <ScrollView style={{paddingTop: Platform.OS === 'ios' ? 20 : 0}}>
        {carleton.map((loc: CarletonDetailMenuType, i, collection) =>
          <View key={`${i}`}>
            <ListRow
              onPress={() => this.onPressRow(loc)}
              arrowPosition='center'>
              <Row alignItems='center'>
                <Title style={styles.rowText}>{loc.title}</Title>
              </Row>
            </ListRow>
            {i < collection.length - 1 ? <ListSeparator spacing={{left: 15}} /> : null}
          </View>
        )}
      </ScrollView>
    )
  }
}
