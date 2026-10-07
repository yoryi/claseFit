import { FlatList, StyleSheet } from 'react-native';
import { EmptyState } from '../../../shared/components/EmptyState';
import { FeedbackBanner } from '../../../shared/components/FeedbackBanner';
import { Screen } from '../../../shared/components/Screen';
import { ReservationCard } from './components/ReservationCard';
import { useReservationsViewModel } from '../viewModel/useReservationsViewModel';

export function MyReservationsScreen() {
  const { reservations, emptyMessage, pending, feedback, askCancel, dismissCancel, confirmCancel } =
    useReservationsViewModel();

  return (
    <Screen title="Mis reservas">
      <FeedbackBanner feedback={feedback} />
      {emptyMessage ? <EmptyState message={emptyMessage} /> : null}
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ReservationCard
            item={item}
            pending={pending?.id === item.id}
            onAskCancel={askCancel}
            onConfirm={confirmCancel}
            onDismiss={dismissCancel}
          />
        )}
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
