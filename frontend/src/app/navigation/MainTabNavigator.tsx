import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ArchiveScreen } from '../../features/archive/screens/ArchiveScreen';
import { HomeScreen } from '../../features/home/screens/HomeScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { RecordScreen } from '../../features/record/screens/RecordScreen';
import { StatsScreen } from '../../features/stats/screens/StatsScreen';

export type MainTabParamList = {
  Home: undefined;
  Archive: undefined;
  Record: undefined;
  Stats: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '지도',
        }}
      />
      <Tab.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          title: '보관함',
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{
          title: '기록하기',
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: '통계',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '내 정보',
        }}
      />
    </Tab.Navigator>
  );
}