import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/app/navigation/RootNavigator';
import { AppProvider } from './src/app/providers/AppProvider';

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
      <StatusBar style="dark" />
    </AppProvider>
  );
}
