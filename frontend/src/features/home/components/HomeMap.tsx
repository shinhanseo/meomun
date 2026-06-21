import { NaverMapView } from '@mj-studio/react-native-naver-map';
import { StyleSheet, View } from 'react-native';

export function HomeMap() {
  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 11,
        }}
        customStyleId="e559247a-fd67-42c6-937b-1d3ae0d97b27"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});