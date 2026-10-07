import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReservationView } from '../../model/Reservation';
import { theme } from '../../../../shared/components/theme';

type ReservationCardProps = {
  item: ReservationView;
  pending: boolean;
  onAskCancel: (reservationId: string) => void;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function ReservationCard({ item, pending, onAskCancel, onConfirm, onDismiss }: ReservationCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.meta}>
        {item.dia} · {item.hora}
      </Text>
      <Text style={styles.meta}>{item.instructor}</Text>
      {pending ? (
        <View style={styles.confirm}>
          <Text style={styles.question}>¿Cancelar esta reserva?</Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Volver" style={styles.choice} onPress={onDismiss}>
              <Text style={styles.secondaryText}>Volver</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Confirmar cancelación de ${item.nombre}`}
              style={styles.choicePrimary}
              onPress={onConfirm}
            >
              <Text style={styles.primaryText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cancelar ${item.nombre}`}
          style={styles.secondary}
          onPress={() => onAskCancel(item.id)}
        >
          <Text style={styles.secondaryText}>Cancelar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 15,
    color: theme.muted,
  },
  confirm: {
    marginTop: 14,
  },
  question: {
    fontSize: 15,
    color: theme.text,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondary: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  choice: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  choicePrimary: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: theme.accent,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
