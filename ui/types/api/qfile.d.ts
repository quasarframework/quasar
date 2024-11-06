export interface QRejectedEntry {
  failedPropValidation:
    | "accept"
    | "max-file-size"
    | "max-total-size"
    | "filter"
    | "max-files"
    | "duplicate";
  file: File;
}

export type QFileNativeElement = Omit<
  Omit<HTMLInputElement, "files"> & { files: FileList },
  "type"
> & { type: "file" };

export type QUseFileAddInput = readonly File[] | FileList;
