import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeScreen } from '../../features/home/screens/HomeScreen';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { StatsScreen } from '../../features/stats/screens/StatsScreen';
import { BottomBar } from '../../shared/components/BottomBar';
import { ArchiveStackNavigator } from './ArchiveStackNavigator';
import type { MainStackParamList } from './MainStackNavigator';

export type MainTabParamList = {
  Home: undefined;
  Archive: undefined;
  Stats: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => (
        <BottomBar
          {...props}
          onPressCreate={() => {
            props.navigation
              .getParent<NativeStackNavigationProp<MainStackParamList>>()
              ?.navigate('RecordWrite');
          }}
        />
      )}
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
        component={ArchiveStackNavigator}
        options={{
          title: '보관함',
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
