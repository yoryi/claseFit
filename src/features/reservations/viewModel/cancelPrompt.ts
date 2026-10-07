export function resolveCancelPrompt(
  pendingId: string | null,
  confirmed: boolean,
  cancel: (id: string) => void,
): null {
  if (confirmed && pendingId) {
    cancel(pendingId);
  }
  return null;
}
