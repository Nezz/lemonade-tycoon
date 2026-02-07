import UnityModule from "@/modules/unity/src/UnityModule";
import { UpgradeId } from "@/engine/types";
import { EventSubscription } from "expo-modules-core";

// ── Inbound (Unity → RN) ────────────────────────────────────────────────────

type InitializedMessage = {
  messageType: "Initialized";
};

type InboundMessage = InitializedMessage;

// ── Outbound (RN → Unity) ───────────────────────────────────────────────────

type UpgradesChangedMessage = {
  messageType: "UpgradesChanged";
  upgrades: UpgradeId[];
};

type CameraView = "day" | "simulation";

type CameraViewChangedMessage = {
  messageType: "CameraViewChanged";
  view: CameraView;
};

type OutboundMessage = UpgradesChangedMessage | CameraViewChangedMessage;

// ── Channel ──────────────────────────────────────────────────────────────────

type MessageListener<T extends InboundMessage> = (message: T) => void;

class UnityMessageChannel {
  private listeners: Map<string, Set<MessageListener<any>>> = new Map();
  private subscription: EventSubscription | null = null;
  private initialized = false;

  constructor() {
    this.setupListener();
    this.addListener("Initialized", () => {
      this.initialized = true;
    });
  }

  private setupListener(): void {
    if (!UnityModule) {
      return;
    }

    this.subscription = UnityModule.addListener(
      "onUnityMessage",
      (payload: { message: string }) => {
        const parsedMessage = JSON.parse(payload.message) as InboundMessage;
        this.notifyListeners(parsedMessage);
      },
    );
  }

  private notifyListeners(message: InboundMessage): void {
    const messageTypeListeners = this.listeners.get(message.messageType);
    if (messageTypeListeners) {
      messageTypeListeners.forEach((listener) => {
        listener(message);
      });
    }
  }

  /**
   * Listen to specific message types from Unity
   */
  addListener<T extends InboundMessage>(
    messageType: T["messageType"],
    listener: MessageListener<T>,
  ): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }

    this.listeners.get(messageType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(messageType);
      if (typeListeners) {
        typeListeners.delete(listener);
        if (typeListeners.size === 0) {
          this.listeners.delete(messageType);
        }
      }
    };
  }

  /**
   * Send a typed message to Unity GameObject
   */
  postMessage(message: OutboundMessage): void {
    if (!UnityModule) {
      return;
    }

    const messageString = JSON.stringify(message);
    UnityModule.postMessage("NativeMessageReceiver", "Receive", messageString);
  }

  /**
   * Run a callback once Unity is ready. If already initialized the callback
   * fires immediately. Also re-fires on any subsequent re-initialization.
   * Returns an unsubscribe function.
   */
  whenReady(callback: () => void): () => void {
    if (this.initialized) {
      callback();
    }
    return this.addListener("Initialized", callback);
  }

  /**
   * Clean up listeners
   */
  destroy(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.listeners.clear();
  }
}

export const unityMessageChannel = new UnityMessageChannel();

/**
 * Send the current list of owned upgrades to Unity.
 */
export function sendUpgradesToUnity(
  upgrades: Record<UpgradeId, boolean>,
): void {
  const owned = (Object.keys(upgrades) as UpgradeId[]).filter(
    (id) => upgrades[id],
  );
  unityMessageChannel.postMessage({
    messageType: "UpgradesChanged",
    upgrades: owned,
  });
}

/**
 * Tell Unity which camera view to show.
 */
export function sendCameraViewToUnity(view: CameraView): void {
  unityMessageChannel.postMessage({
    messageType: "CameraViewChanged",
    view,
  });
}
