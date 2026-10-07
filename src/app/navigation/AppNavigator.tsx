import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UpcomingClassesScreen } from '../../features/classes/view/UpcomingClassesScreen';
import { MyReservationsScreen } from '../../features/reservations/view/MyReservationsScreen';
import { theme } from '../../shared/components/theme';

export type RootTabParamList = {
  Clases: undefined;
  'Mis reservas': undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none', width: 0, height: 0 },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.line,
        },
      }}
    >
      <Tab.Screen name="Clases" component={UpcomingClassesScreen} />
      <Tab.Screen name="Mis reservas" component={MyReservationsScreen} />
    </Tab.Navigator>
  );
}
