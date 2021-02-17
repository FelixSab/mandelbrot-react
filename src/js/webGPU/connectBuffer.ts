type Constructors = Uint8ArrayConstructor | Float32ArrayConstructor;

export function connectBuffer<T extends Constructors>(buffer: WebGPU.Buffer, constructor: T) {
  const range = buffer.getMappedRange();
  return new constructor(range);
}
