import { QNotifyCreateOptions, QBtnProps, LiteralUnion  } from "quasar";
import { ButtonHTMLAttributes } from "vue";

export type QNotifyUpdateOptions = Omit<
  QNotifyCreateOptions,
  "group" | "position"
>;
export type QNotifyOptions = Omit<QNotifyCreateOptions, "ignoreDefaults">;

export interface QNotifyCustomTypes {};

type NotifyTypes =  
  | 'positive'
  | 'negative'
  | 'warning'
  | 'info'
  | 'ongoing';

export type QNotifyType = LiteralUnion<NotifyTypes | keyof QNotifyCustomTypes>;


export type QNotifyAction = Omit<QBtnProps, "onClick"> &
  ButtonHTMLAttributes & { noDismiss?: boolean; handler?: () => void };
