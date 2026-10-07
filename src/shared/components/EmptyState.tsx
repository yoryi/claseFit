import { StyleSheet, Text } from 'react-native';
import { theme } from './theme';

export function EmptyState({ message }: { message: string }) {
  return <Text style={styles.message}>{message}</Text>;
}

const styles = StyleSheet.create({
  message: {
    marginHorizontal: 20,
    marginTop: 24,
    fontSize: 16,
    lineHeight: 22,
    color: theme.muted,
  },
});
