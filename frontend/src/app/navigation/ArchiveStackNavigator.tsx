import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArchiveScreen } from '../../features/archive/screens/ArchiveScreen';

export type ArchiveStackParamList = {
  ArchiveHome: undefined;
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
    </Stack.Navigator>
  );
}
