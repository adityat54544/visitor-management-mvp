import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Visitor } from '../api/types';

export type TabParamList = {
  DashboardTab: undefined;
  VisitorsTab: { initialStatus?: string } | undefined;
  RegisterTab: undefined;
  NotificationsTab: undefined;
  ReportsTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  VisitorDetails: { visitor: Visitor };
  QrCheckin: undefined;
  AdminUsers: undefined;
};