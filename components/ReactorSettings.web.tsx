import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { fetchInsecureJwtToken } from "@reactor-team/js-sdk";
import { useReactorStore } from "@/store/reactorStore";
import { C, F, PIXEL_FONT, pixelPanel, pixelBevel } from "@/theme/pixel";

type Status = "idle" | "validating" | "valid" | "error";

export default function ReactorSettings() {
  const apiKey = useReactorStore((s) => s.apiKey);
  const setApiKey = useReactorStore((s) => s.setApiKey);
  const clearApiKey = useReactorStore((s) => s.clearApiKey);

  const [draft, setDraft] = useState(apiKey);
  const [status, setStatus] = useState<Status>(apiKey ? "valid" : "idle");

  // Keep draft in sync when store changes externally
  useEffect(() => {
    setDraft(apiKey);
    setStatus(apiKey ? "valid" : "idle");
  }, [apiKey]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      clearApiKey();
      setStatus("idle");
      return;
    }

    setStatus("validating");
    try {
      await fetchInsecureJwtToken(trimmed);
      setApiKey(trimmed);
      setStatus("valid");
    } catch {
      setStatus("error");
    }
  };

  const handleClear = () => {
    clearApiKey();
    setDraft("");
    setStatus("idle");
  };

  const statusColor =
    status === "valid"
      ? C.greenLight
      : status === "error"
        ? C.red
        : C.textMuted;

  const statusLabel =
    status === "validating"
      ? "VALIDATING..."
      : status === "valid"
        ? "CONNECTED"
        : status === "error"
          ? "INVALID KEY"
          : "NOT SET";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>AI VIDEO</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        Enter a Reactor API key to see what your lemonade stand looks like!
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="rk_..."
          placeholderTextColor={C.textMuted}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        {status === "validating" ? (
          <ActivityIndicator color={C.gold} size="small" />
        ) : apiKey ? (
          <Pressable style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.btnText}>CLEAR</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.saveBtn, !draft.trim() && styles.btnDisabled]}
            onPress={handleSave}
            disabled={!draft.trim()}
          >
            <Text style={styles.btnText}>SAVE</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...pixelPanel,
    ...pixelBevel,
    marginVertical: 8,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.gold,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
  },
  statusText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
  },
  description: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  input: {
    flex: 1,
    height: 38,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: C.border,
    borderTopColor: C.borderDark,
    borderLeftColor: C.borderDark,
    borderBottomColor: C.borderLight,
    borderRightColor: C.borderLight,
    backgroundColor: C.bgLight,
    paddingHorizontal: 8,
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  saveBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderWidth: 3,
    backgroundColor: C.btnPrimary,
    borderTopColor: C.btnPrimaryHi,
    borderLeftColor: C.btnPrimaryHi,
    borderBottomColor: C.btnPrimaryLo,
    borderRightColor: C.btnPrimaryLo,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtn: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderWidth: 3,
    backgroundColor: C.btnSecondary,
    borderTopColor: C.btnSecHi,
    borderLeftColor: C.btnSecHi,
    borderBottomColor: C.btnSecLo,
    borderRightColor: C.btnSecLo,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
