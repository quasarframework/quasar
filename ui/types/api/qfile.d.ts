export interface QRejectedEntry {
  failedPropValidation:
    | "accept"
    | "max-file-size"
    | "max-total-size"
    | "filter";
  file: File;
}

export type QFileNativeElement = Omit<
  Omit<HTMLInputElement, "files"> & { files: FileList },
  "type"
> & { type: "file" };
