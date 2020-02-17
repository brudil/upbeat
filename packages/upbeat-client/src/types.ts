import { Timestamp } from '../../upbeat-core/src/timestamp';

export type Cb = (data: any) => void;

export interface Operation {
  id: string;
  resourceId: string;
  resource: string;
  property: string;
  value: unknown;
  timestamp: Timestamp;
}

export interface TypedOperation<RN extends string, P extends string>
  extends Operation {
  resource: RN;
  property: P;
}

export type ResourceCache<R> = Partial<{ [K in keyof R]: Operation }>;
export type ResourceCacheMap<R> = { [id: string]: ResourceCache<R> };
