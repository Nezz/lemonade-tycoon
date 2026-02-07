import * as Haptics from "expo-haptics";

export function tapHaptic(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function heavyTapHaptic(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function successHaptic(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function errorHaptic(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export function selectionHaptic(): void {
  Haptics.selectionAsync();
}
