import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EmotionArchiveDetailScreen } from '../../features/archive/screens/EmotionArchiveDetailScreen';
import { PlaceArchiveDetailScreen } from '../../features/archive/screens/PlaceArchiveDetailScreen';
import { PlaceSelectScreen } from '../../features/place/screens/PlaceSelectScreen';
import { RecordDetailScreen } from '../../features/record/screens/RecordDetailScreen';
import { RecordWriteScreen } from '../../features/record/screens/RecordWriteScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { RecordEditScreen } from '../../features/record/screens/RecordEditScreen';
import type { MainTabParamList } from './MainTabNavigator';
import type { EmotionCode } from '../../shared/constants/emotionMeta';

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RecordWrite: undefined;
  RecordDetail: {
    recordId: string;
    backBehavior?: 'goBack' | 'home';
  };
  RecordEdit: {
    recordId: string;
  };
  PlaceSelect: undefined;
  PlaceArchiveDetail: {
    placeId: string;
  };
  EmotionArchiveDetail: {
    emotion: EmotionCode;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="RecordWrite" component={RecordWriteScreen} />
      <Stack.Screen name="RecordEdit" component={RecordEditScreen} />
      <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
      <Stack.Screen name="PlaceSelect" component={PlaceSelectScreen} />
      <Stack.Screen
        name="PlaceArchiveDetail"
        component={PlaceArchiveDetailScreen}
      />
      <Stack.Screen
        name="EmotionArchiveDetail"
        component={EmotionArchiveDetailScreen}
      />
    </Stack.Navigator>
  );
}
