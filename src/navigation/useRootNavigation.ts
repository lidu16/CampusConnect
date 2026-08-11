import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

type StackNav = NavigationProp<RootStackParamList>;

/**
 * Navigate from a nested tab screen to a root stack screen (e.g. CreateEvent).
 */
export function useRootNavigation() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const navigate = (screen: keyof RootStackParamList) => {
    const parent = navigation.getParent() as StackNav | undefined;
    if (parent?.navigate) {
      parent.navigate(screen);
      return;
    }
    (navigation as StackNav).navigate(screen);
  };

  const goBack = () => {
    const parent = navigation.getParent() as StackNav | undefined;
    if (parent?.canGoBack()) {
      parent.goBack();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return { navigate, goBack };
}
