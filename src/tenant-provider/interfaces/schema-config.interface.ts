export abstract class SchemaConfigAbstract {
  private static schema: string = 'public';

  public static get(): string {
    return this.schema;
  }

  public static set(schemaName: string): void {
    this.schema = schemaName;
  }
}
