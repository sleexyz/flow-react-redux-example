// @flow

// Proxy type
export class TypeRep<A> {
  verify(x: A): A {
    return x;
  }
}

export class FuncRep<A, B> extends TypeRep<(A) => B> {
  a: TypeRep<A>;
  b: TypeRep<B>;
  constructor(a: TypeRep<A>, b: TypeRep<B>) {
    super();
    this.a = a;
    this.b = b;
  }
}
// Test: FuncRep
() => {
  const StringRep: TypeRep<string> = new TypeRep();
  const NumberRep: TypeRep<number> = new TypeRep();
  const len = new FuncRep(StringRep, NumberRep);
  (len: TypeRep<(string) => number>);
  (len.a: TypeRep<string>);
  // $FlowFixMe
  (len.a: TypeRep<number>);
  // $FlowFixMe
  (len.b: TypeRep<string>);
};

export class RecordRep<
  O: {},
  E: $ObjMap<O, <V>(TypeRep<V>) => V>
> extends TypeRep<E> {
  map: O;
  constructor(map: O) {
    super();
    this.map = map;
  }
  verify(x: E): E {
    return x;
  }
}

// Test: RecordRep
() => {
  const rec = new RecordRep({
    foo: (new TypeRep(): TypeRep<string>),
    bar: (new TypeRep(): TypeRep<number>)
  });

  (rec: TypeRep<{
    foo: string, // ok
    bar: number // ok
  }>);
  (rec.map.foo: TypeRep<string>); // ok
  (rec.map.bar: TypeRep<number>); // ok
  // $FlowFixMe
  (rec.map.foo: TypeRep<number>); // error
  // $FlowFixMe
  (rec.map.bar: TypeRep<string>); // error
};

// Test
() => {
  const myRecord = new RecordRep({
    getName: new FuncRep(
      (new TypeRep(): TypeRep<void>),
      (new TypeRep(): TypeRep<string>)
    ),
    setName: new FuncRep(
      (new TypeRep(): TypeRep<string>),
      (new TypeRep(): TypeRep<void>)
    )
  });

  (myRecord: TypeRep<{
    getName: void => string, // ok
    setName: string => void // ok
  }>);

  myRecord.verify({
    getName: () => "hello", // ok
    setName: x => {} // ok
  });

  myRecord.verify({
    // $FlowFixMe
    getName: null, // error
    // $FlowFixMe
    setName: x => x // error
  });
};

declare class MyAPI {
  endpoints: {
    getName(): string,
    setName(string): void
  }
}

// interface API<A> {
// }
// export class EndpointRep<A, B> extends FuncRep<A,B> implements API<A => B>{
// }
// export class APIRep<O: {}> extends RecordRep<O> implements API<$ObjMap<O, <V>(TypeRep<V>) => V>> {
// }

// Test: APIRep
