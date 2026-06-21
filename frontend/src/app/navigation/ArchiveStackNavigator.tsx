import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArchiveScreen } from '../../features/archive/screens/ArchiveScreen';
import { EmotionArchiveScreen } from '../../features/archive/screens/EmotionArchiveScreen';
import { MonthlyArchiveScreen } from '../../features/archive/screens/MonthlyArchiveScreen';
import { PlaceArchiveScreen } from '../../features/archive/screens/PlaceArchiveScreen';

export type ArchiveStackParamList = {
  ArchiveHome: undefined;
  MonthlyArchive: undefined;
  PlaceArchive: undefined;
  EmotionArchive: undefined;
};

const Stack = createNativeStackNavigator<ArchiveStackParamList>();

export function ArchiveStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ArchiveHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ArchiveHome" component={ArchiveScreen} />
      <Stack.Screen name="MonthlyArchive" component={MonthlyArchiveScreen} />
      <Stack.Screen name="PlaceArchive" component={PlaceArchiveScreen} />
      <Stack.Screen name="EmotionArchive" component={EmotionArchiveScreen} />
    </Stack.Navigator>
  );
}
