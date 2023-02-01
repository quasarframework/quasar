import { QNotifyCreateOptions, QBtnProps } from "quasar";
import { ButtonHTMLAttributes } from "vue";

export type QNotifyUpdateOptions = Omit<
  QNotifyCreateOptions,
  "group" | "position"
>;
export type QNotifyOptions = Omit<QNotifyCreateOptions, "ignoreDefaults">;

export type QNotifyAction = Omit<QBtnProps, "onClick"> &
  ButtonHTMLAttributes & { noDismiss?: boolean; handler?: () => void };
