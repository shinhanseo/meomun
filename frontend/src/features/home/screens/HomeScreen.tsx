import { StyleSheet, View } from 'react-native';

import { HomeMap } from '../components/HomeMap';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});