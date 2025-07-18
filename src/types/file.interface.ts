// Tipos para manejo de archivos
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Respuesta de upload de archivo
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  url: string;
}

// Tipos para validación de archivos
export interface FileValidation {
  maxSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}
