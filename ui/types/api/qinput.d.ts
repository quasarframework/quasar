import { QInputProps } from "quasar";

type QInputType = NonNullable<QInputProps["type"]>;

type WithKnownType<
  TElement extends HTMLInputElement | HTMLTextAreaElement,
  TType extends QInputType,
> = Omit<TElement, "type"> & { type: TType };

/**
 * @example
 * ```ts
 * QInputNativeElement                      // HTMLInputElement | HTMLTextAreaElement
 * QInputNativeElement<"textarea">          // HTMLTextAreaElement
 * QInputNativeElement<"text">              // Omit<HTMLInputElement, "type"> & { type: "text" }
 * QInputNativeElement<"text" | "number">   // Omit<HTMLInputElement, "type"> & { type: "text" | "number" }
 * QInputNativeElement<"text" | "textarea"> // (Omit<HTMLInputElement, "type"> & { type: "text" }) | HTMLTextAreaElement
 * ```
 */
export type QInputNativeElement<T extends QInputType = QInputType> =
  T extends "textarea"
    ? WithKnownType<HTMLTextAreaElement, "textarea">
    : Omit<WithKnownType<HTMLInputElement, T>, "files"> & {
        files: T extends "file" ? FileList : null;
      };
