/* eslint-disable @typescript-eslint/no-explicit-any */
export type SettledInfer<
  T,
  Null extends undefined | null = undefined,
  Data extends Array<any> = [],
> = T extends readonly [Promise<infer U>, ...infer R]
  ? R extends []
    ? [...Data, U | Null]
    : SettledInfer<R, Null, [...Data, U | Null]>
  : T extends Promise<infer U>[]
    ? Promise<(U | undefined)[]>
    : never;

type AllPromise = readonly Promise<any>[];

//Replace Promise.allSettled, because Promise.allSettled can not reserve type of the result
export function promiseAllSettled<const T extends AllPromise>(promises: T) {
  return Promise.allSettled(promises).then((result) =>
    result.map((data) => {
      if (data.status === "fulfilled") {
        return data.value;
      }

      //replace by logger
      console.log(data.status);
      console.error(data.reason);
      return undefined;
    }),
  ) as Promise<SettledInfer<T>>;
}
