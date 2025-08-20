export interface IUploadFile {
  originalName: string;
  fileName: string;
  fileExt: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  createdBy?: number | null;
}
