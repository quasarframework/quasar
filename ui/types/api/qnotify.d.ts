import { QNotifyCreateOptions, QBtnProps, LiteralUnion  } from "quasar";
import { ButtonHTMLAttributes } from "vue";

export type QNotifyUpdateOptions = Omit<
  QNotifyCreateOptions,
  "group" | "position"
>;
export type QNotifyOptions = Omit<QNotifyCreateOptions, "ignoreDefaults">;

export interface NotifyCustomTypes {};

type NotifyTypes =  
  | 'positive'
  | 'negative'
  | 'warning'
  | 'info'
  | 'ongoing';

export type NotifyType = LiteralUnion<NotifyTypes | keyof NotifyCustomTypes>;


export type QNotifyAction = Omit<QBtnProps, "onClick"> &
  ButtonHTMLAttributes & { noDismiss?: boolean; handler?: () => void };
