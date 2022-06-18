export interface QRejectedEntry {
  failedPropValidation:
    | "accept"
    | "max-file-size"
    | "max-total-size"
    | "filter";
  file: File;
}
