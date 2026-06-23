import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from './src/app/navigation/RootNavigator';
import { AppProvider } from './src/app/providers/AppProvider';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
