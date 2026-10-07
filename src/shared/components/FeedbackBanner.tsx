import { StyleSheet, Text, View } from 'react-native';
import type { Feedback } from '../types/feedback';
import { theme } from './theme';

export function FeedbackBanner({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) {
    return null;
  }

  const error = feedback.tone === 'error';
  return (
    <View style={[styles.banner, error ? styles.error : styles.success]}>
      <Text style={[styles.text, error ? styles.errorText : styles.successText]}>{feedback.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  success: {
    backgroundColor: theme.successBg,
  },
  error: {
    backgroundColor: theme.errorBg,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  successText: {
    color: theme.successText,
  },
  errorText: {
    color: theme.errorText,
  },
});
