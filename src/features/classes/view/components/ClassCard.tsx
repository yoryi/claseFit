import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { UpcomingClass } from '../../model/Class';
import { theme } from '../../../../shared/components/theme';

type ClassCardProps = {
  item: UpcomingClass;
  onReserve: (classId: string) => void;
};

export function ClassCard({ item, onReserve }: ClassCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.name}>{item.nombre}</Text>
        <Text style={[styles.spots, item.llena ? styles.full : null]}>{item.cupoVisible}</Text>
      </View>
      <Text style={styles.meta}>
        {item.dia} · {item.hora}
      </Text>
      <Text style={styles.meta}>{item.instructor}</Text>
      {item.puedeReservar ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Reservar ${item.nombre}`}
          style={styles.button}
          onPress={() => onReserve(item.id)}
        >
          <Text style={styles.buttonText}>Reservar</Text>
        </Pressable>
      ) : null}
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
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
  },
  spots: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.accent,
  },
  full: {
    color: theme.full,
    backgroundColor: theme.fullBg,
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  meta: {
    marginTop: 4,
    fontSize: 15,
    color: theme.muted,
  },
  button: {
    marginTop: 14,
    backgroundColor: theme.accent,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
