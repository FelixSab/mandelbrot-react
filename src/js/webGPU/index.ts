import { createDevice } from './createDevice';
import { connectBuffer } from './connectBuffer';
export * from './setupTestMatrix';
export * from './createDevice';
export * from './connectBuffer';

export async function setupWebGPU() {
  const device = await createDevice();
  if (!device) return;

  // Get a GPU buffer in a mapped state and an arrayBuffer for writing.
  const gpuWriteBuffer = device.createBuffer({
    mappedAtCreation: true,
    size: 4,
    usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
  });

  connectBuffer(gpuWriteBuffer, Uint8Array).set([0, 1, 2, 3]);
  // Unmap buffer so that it can be used later for copy.
  gpuWriteBuffer.unmap();

  // Get a GPU buffer for reading in an unmapped state.
  const gpuReadBuffer = device.createBuffer({
    size: 4,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  // Encode commands for copying buffer to buffer.
  const copyEncoder = device.createCommandEncoder();
  copyEncoder.copyBufferToBuffer(
    gpuWriteBuffer /* source buffer */,
    0 /* source offset */,
    gpuReadBuffer /* destination buffer */,
    0 /* destination offset */,
    4 /* size */,
  );

  // Submit copy commands.
  const copyCommands = copyEncoder.finish();
  device.queue.submit([copyCommands]);

  // Read buffer.
  await gpuReadBuffer.mapAsync(GPUMapMode.READ);
  console.log(connectBuffer(gpuReadBuffer, Uint8Array));
}
