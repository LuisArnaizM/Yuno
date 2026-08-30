type Primitive = string | number | boolean | null | undefined;

export class FilterQuery<T extends Record<string, Primitive>> {
  private readonly filters = new Map<keyof T, T[keyof T]>();

  by<K extends keyof T>(key: K, value: T[K]): this {
    this.filters.set(key, value);
    return this;
  }

  byMany(filters: Partial<T>): this {
    for (const [key, value] of Object.entries(filters) as Array<
      [keyof T, T[keyof T]]
    >) {
      if (value !== undefined) {
        this.filters.set(key, value);
      }
    }

    return this;
  }

  toObject(): Partial<T> {
    return Object.fromEntries(this.filters.entries()) as Partial<T>;
  }

  clear(): this {
    this.filters.clear();
    return this;
  }

  hasFilters(): boolean {
    return this.filters.size > 0;
  }

  static from<T extends Record<string, Primitive>>(filters: Partial<T>) {
    return new FilterQuery<T>().byMany(filters);
  }
}
