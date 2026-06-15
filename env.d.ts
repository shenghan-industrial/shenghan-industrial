declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KV_STORE?: KVNamespace;
      R2_STORE?: R2Bucket;
    }
  }

  interface KVNamespace {
    get(key: string, type?: "json" | "text" | "arrayBuffer" | "stream"): Promise<any>;
    put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number }): Promise<{ keys: { name: string }[] }>;
  }

  interface R2Bucket {
    put(key: string, value: ArrayBuffer | Uint8Array | ReadableStream, options?: R2PutOptions): Promise<R2Object>;
    get(key: string): Promise<R2Object | null>;
    delete(key: string): Promise<void>;
  }

  interface R2PutOptions {
    httpMetadata?: { contentType?: string; cacheControl?: string };
  }

  interface R2Object {
    body: ReadableStream | null;
    writeHttpMetadata(headers: Headers): void;
  }
}

export {};
