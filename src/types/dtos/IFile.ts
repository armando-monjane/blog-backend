export interface IFile extends File {
    originalname: string;
    name: string;
    mimetype: string;
    buffer: Buffer;
    url: string;
}