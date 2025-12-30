export class BufferFile {
  public constructor(
    public readonly name: string,
    public readonly file: Buffer,
    public readonly extension: string,
    public readonly mimeType: string,
  ) {}
}
