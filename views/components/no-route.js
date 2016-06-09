import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'

export default function NoRoute({navigator}) {
  return (
    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
      <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => navigator.pop()}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>
          No Route Found
        </Text>
      </TouchableOpacity>
    </View>
  )
}