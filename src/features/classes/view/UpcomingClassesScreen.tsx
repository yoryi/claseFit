import { FlatList, StyleSheet } from 'react-native';
import { FeedbackBanner } from '../../../shared/components/FeedbackBanner';
import { Screen } from '../../../shared/components/Screen';
import { ClassCard } from './components/ClassCard';
import { useClassesViewModel } from '../viewModel/useClassesViewModel';

export function UpcomingClassesScreen() {
  const { socioNombre, classes, feedback, reserve } = useClassesViewModel();

  return (
    <Screen title="Próximas clases" subtitle={socioNombre}>
      <FeedbackBanner feedback={feedback} />
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ClassCard item={item} onReserve={reserve} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});
