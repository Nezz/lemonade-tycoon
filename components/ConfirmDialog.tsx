import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { C, PIXEL_FONT, F, pixelBevel } from "@/theme/pixel";
import GameButton from "@/components/GameButton";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.divider} />
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <GameButton
              title={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              small
              style={styles.btn}
            />
            <GameButton
              title={confirmLabel}
              onPress={onConfirm}
              variant={variant}
              small
              style={styles.btn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: C.panel,
    borderWidth: 3,
    ...pixelBevel,
    padding: 16,
  },
  title: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.gold,
    textAlign: "center",
  },
  divider: {
    height: 2,
    backgroundColor: C.border,
    marginVertical: 10,
  },
  message: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    textAlign: "center",
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
  },
});
