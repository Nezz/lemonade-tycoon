import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  ReactorProvider,
  ReactorView,
  useReactor,
  useReactorMessage,
  fetchInsecureJwtToken,
} from "@reactor-team/js-sdk";
import StripedBackground from "@/components/StripedBackground";
import { useReactorStore } from "@/store/reactorStore";
import { useGameStore } from "@/store/gameStore";
import {
  buildOpeningPrompt,
  buildSellingPrompt,
  buildEventPrompt,
  buildClosingPrompt,
  buildSoldOutPrompt,
} from "@/utils/reactorPrompts";
import { C, PIXEL_FONT, F } from "@/theme/pixel";
import type { DayResult } from "@/engine/types";

// ── Timing constants (match simulation.tsx) ──────────────────────────────────

const MS_PER_HOUR = 3000;

/** Max time to wait for Reactor before falling back. */
const CONNECTION_TIMEOUT_MS = 20_000;

// ── Types ────────────────────────────────────────────────────────────────────

interface StateMessage {
  type: "state";
  data: {
    current_frame: number;
    current_prompt: string | null;
    paused: boolean;
    scheduled_prompts: Record<number, string>;
  };
}

interface EventMessage {
  type: "event";
  data: {
    event: string;
    frame?: number;
    message?: string;
  };
}

type LivecoreMessage = StateMessage | EventMessage;

// ── ReactorController (headless) ─────────────────────────────────────────────

/**
 * Manages the prompt lifecycle for a single simulation run.
 * Auto-connects on mount, signals readiness via `onReady`,
 * schedules prompts based on game state, and disconnects on unmount.
 */
function ReactorController({
  result,
  onReady,
}: {
  result: DayResult;
  onReady: () => void;
}) {
  const { sendCommand, status, connect, disconnect } = useReactor((state) => ({
    sendCommand: state.sendCommand,
    status: state.status,
    connect: state.connect,
    disconnect: state.disconnect,
  }));

  const currentFrameRef = useRef(0);
  const promptsSent = useRef<Set<string>>(new Set());
  const didConnect = useRef(false);
  const readyFired = useRef(false);

  // Track current frame from model state messages
  useReactorMessage((message: LivecoreMessage) => {
    if (message?.type === "state") {
      currentFrameRef.current = message.data.current_frame;
    }
  });

  // Auto-connect with a delay so React Strict Mode's double-render cleanup
  // can cancel the first attempt before it fires. Without this, the
  // ReactorProvider disconnects the session in its first-render cleanup.
  useEffect(() => {
    if (status === "disconnected" && !didConnect.current) {
      const timer = setTimeout(() => {
        didConnect.current = true;
        connect();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [status, connect]);

  // Disconnect only on final unmount
  useEffect(() => {
    return () => {
      if (didConnect.current) {
        try {
          disconnect();
        } catch {
          // Ignore if no active session
        }
      }
    };
  }, [disconnect]);

  // Signal readiness + schedule prompts when ready.
  // Adds a brief delay after "ready" so the WebRTC data channel has time
  // to open (status flips to "ready" before the data channel is usable).
  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Wait for the data channel to finish opening
    const DATA_CHANNEL_DELAY = 500;

    timers.push(
      setTimeout(() => {
        // Signal parent that video is live
        if (!readyFired.current) {
          readyFired.current = true;
          onReady();
        }

        const sendPrompt = async (key: string, prompt: string) => {
          if (promptsSent.current.has(key)) {
            return;
          }
          promptsSent.current.add(key);

          const timestamp =
            currentFrameRef.current === 0 ? 0 : currentFrameRef.current + 3;

          await sendCommand("schedule_prompt", {
            new_prompt: prompt,
            timestamp,
          });

          // Start generation on first prompt
          if (key === "opening") {
            await sendCommand("start", {});
          }
        };

        // Determine if the day ended early due to sold out
        const ranOutOfStock =
          result.cupsSold > 0 && result.maxSellable < result.maxDemand;

        // t=0: Opening (immediate after data channel delay)
        sendPrompt("opening", buildOpeningPrompt(result));

        // t=3s (1 game hour): Selling begins
        timers.push(
          setTimeout(() => {
            sendPrompt("selling", buildSellingPrompt(result));
          }, 1 * MS_PER_HOUR),
        );

        // t=6s (2 game hours): First surprise event
        if (result.surpriseEvents.length > 0) {
          timers.push(
            setTimeout(() => {
              sendPrompt(
                "event0",
                buildEventPrompt(result.surpriseEvents[0], result.weather),
              );
            }, 2 * MS_PER_HOUR),
          );
        }

        // t=12s (4 game hours): Second surprise event
        if (result.surpriseEvents.length > 1) {
          timers.push(
            setTimeout(() => {
              sendPrompt(
                "event1",
                buildEventPrompt(result.surpriseEvents[1], result.weather),
              );
            }, 4 * MS_PER_HOUR),
          );
        }

        // t=18-21s (6-7 game hours): Closing or sold out
        const closingDelay = ranOutOfStock ? 5 * MS_PER_HOUR : 6 * MS_PER_HOUR;
        timers.push(
          setTimeout(() => {
            if (ranOutOfStock) {
              sendPrompt("soldout", buildSoldOutPrompt(result));
            } else {
              sendPrompt("closing", buildClosingPrompt(result));
            }
          }, closingDelay),
        );
      }, DATA_CHANNEL_DELAY),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [status, result, sendCommand, onReady]);

  return null;
}

// ── Loading screen shown while Reactor connects ──────────────────────────────

function ConnectingScreen() {
  return (
    <View style={styles.connectingContainer}>
      <ActivityIndicator color={C.gold} size="large" />
      <Text style={styles.connectingText}>CONNECTING TO AI VIDEO...</Text>
    </View>
  );
}

// ── ReactorSimulation (provider + view + controller + gate) ──────────────────

function ReactorSimulation({
  jwtToken,
  result,
  children,
  onFallback,
}: {
  jwtToken: string;
  result: DayResult;
  children: React.ReactNode;
  onFallback: () => void;
}) {
  const [ready, setReady] = useState(false);

  // Timeout: if Reactor isn't ready in time, fall back to static bg
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!ready) {
        onFallback();
      }
    }, CONNECTION_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [ready, onFallback]);

  return (
    <ReactorProvider
      modelName="livecore"
      jwtToken={jwtToken}
      autoConnect={false}
    >
      <View style={styles.container}>
        {/* Video background (always mounted so it can connect) */}
        <View style={styles.videoContainer}>
          <ReactorView
            className="reactor-video"
            videoObjectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Prompt controller (headless) */}
        <ReactorController result={result} onReady={() => setReady(true)} />

        {/* Gate children behind readiness — delays simulation timers */}
        {ready ? children : <ConnectingScreen />}
      </View>
    </ReactorProvider>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

interface SimulationBackgroundProps {
  children: React.ReactNode;
}

export default function SimulationBackground({
  children,
}: SimulationBackgroundProps) {
  const apiKey = useReactorStore((s) => s.apiKey);
  const getLastResult = useGameStore((s) => s.getLastResult);
  const result = getLastResult();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Fetch JWT when apiKey is available
  useEffect(() => {
    if (!apiKey) {
      setJwtToken(null);
      return;
    }

    let cancelled = false;
    fetchInsecureJwtToken(apiKey)
      .then((token) => {
        if (!cancelled) {
          setJwtToken(token);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUseFallback(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // Use Reactor if we have a valid token and game result, and haven't timed out
  if (jwtToken && result && !useFallback) {
    return (
      <ReactorSimulation
        jwtToken={jwtToken}
        result={result}
        onFallback={() => setUseFallback(true)}
      >
        {children}
      </ReactorSimulation>
    );
  }

  // Fallback: original striped background
  return <StripedBackground>{children}</StripedBackground>;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  connectingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  connectingText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.gold,
  },
});
