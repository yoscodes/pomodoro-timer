// 通知がサポートされているか
export const isNotificationSupported = () => "Notification" in window;

// 通知の許可をユーザーに求める（必ずユーザーアクション内で呼ぶこと）
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return "denied";

  if (Notification.permission === "granted") return "granted";

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Notification permission request failed", error);
      return "denied";
    }
  }

  return Notification.permission;
};

// 通知を表示する（許可がある前提）
export const showNotification = (message, options = {}, onClick) => {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    console.warn(
      "Cannot show notification: permission not granted or not supported."
    );
    return null;
  }

  const defaultOptions = {
    requireInteraction: true,
    tag: "pomodoro-notification",
    ...options,
  };

  const notif = new Notification(message, defaultOptions);

  if (onClick) {
    notif.onclick = (e) => {
      onClick(e);
      notif.close();
      window.focus();
    };
  }

  return notif;
};
