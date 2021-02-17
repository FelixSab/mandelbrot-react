import { createDevice, connectBuffer } from 'js/webGPU';
import glslangModule from '@webgpu/glslang/dist/web-devel/glslang';

// declare var glslangModule: any;

// First Matrix
const firstMatrix = new Float32Array([2 /* rows */, 4 /* columns */, 1, 2, 3, 4, 5, 6, 7, 8]);

const secondMatrix = new Float32Array([4 /* rows */, 2 /* columns */, 1, 2, 3, 4, 5, 6, 7, 8]);

const resultMatrixBufferSize = Float32Array.BYTES_PER_ELEMENT * (2 + firstMatrix[0] * secondMatrix[1]);

function setupMatritzes(device: WebGPU.Device) {
  const gpuBufferFirstMatrix = device.createBuffer({
    mappedAtCreation: true,
    size: firstMatrix.byteLength,
    usage: GPUBufferUsage.STORAGE,
  });

  connectBuffer(gpuBufferFirstMatrix, Float32Array).set(firstMatrix);
  gpuBufferFirstMatrix.unmap();
  // Second Matrix

  const gpuBufferSecondMatrix = device.createBuffer({
    mappedAtCreation: true,
    size: secondMatrix.byteLength,
    usage: GPUBufferUsage.STORAGE,
  });

  connectBuffer(gpuBufferSecondMatrix, Float32Array).set(secondMatrix);
  gpuBufferSecondMatrix.unmap();

  // Result Matrix
  const resultMatrixBuffer = device.createBuffer({
    size: resultMatrixBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  return [gpuBufferFirstMatrix, gpuBufferSecondMatrix, resultMatrixBuffer] as const;
}

function setupBindGroup(
  device: WebGPU.Device,
  computePipeline: WebGPU.ComputePipeline,
  [gpuBufferFirstMatrix, gpuBufferSecondMatrix, resultMatrixBuffer]: readonly [
    WebGPU.Buffer,
    WebGPU.Buffer,
    WebGPU.Buffer,
  ],
) {
  const bindGroup = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0 /* index */),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: gpuBufferFirstMatrix,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: gpuBufferSecondMatrix,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: resultMatrixBuffer,
        },
      },
    ],
  });

  return bindGroup;
}

const computeShaderCode = `#version 450

  layout(std430, set = 0, binding = 0) readonly buffer FirstMatrix {
      vec2 size;
      float numbers[];
  } firstMatrix;

  layout(std430, set = 0, binding = 1) readonly buffer SecondMatrix {
      vec2 size;
      float numbers[];
  } secondMatrix;

  layout(std430, set = 0, binding = 2) buffer ResultMatrix {
      vec2 size;
      float numbers[];
  } resultMatrix;

  void main() {
    resultMatrix.size = vec2(firstMatrix.size.x, secondMatrix.size.y);

    ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    float result = 0.0;
    for (int i = 0; i < firstMatrix.size.y; i++) {
      int a = i + resultCell.x * int(firstMatrix.size.y);
      int b = resultCell.y + i * int(secondMatrix.size.y);
      result += firstMatrix.numbers[a] * secondMatrix.numbers[b];
    }

    int index = resultCell.y + resultCell.x * int(secondMatrix.size.y);
    resultMatrix.numbers[index] = result;
  }
`;

export async function setupTextMatrix() {
  const device = await createDevice();
  if (!device) return;

  const [gpuBufferFirstMatrix, gpuBufferSecondMatrix, resultMatrixBuffer] = setupMatritzes(device);

  const glslang = await glslangModule();

  const computePipeline = device.createComputePipeline({
    computeStage: {
      module: device.createShaderModule({
        code: glslang.compileGLSL(computeShaderCode, 'compute', true),
      }),
      entryPoint: 'main',
    },
  });

  const bindGroup = setupBindGroup(device, computePipeline, [
    gpuBufferFirstMatrix,
    gpuBufferSecondMatrix,
    resultMatrixBuffer,
  ]);
  const commandEncoder = device.createCommandEncoder();

  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatch(firstMatrix[0] /* x */, secondMatrix[1] /* y */);
  passEncoder.endPass();

  // Get a GPU buffer for reading in an unmapped state.
  const gpuReadBuffer = device.createBuffer({
    size: resultMatrixBufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  // Encode commands for copying buffer to buffer.
  commandEncoder.copyBufferToBuffer(
    resultMatrixBuffer /* source buffer */,
    0 /* source offset */,
    gpuReadBuffer /* destination buffer */,
    0 /* destination offset */,
    resultMatrixBufferSize /* size */,
  );

  // Submit GPU commands.
  const gpuCommands = commandEncoder.finish();
  device.queue.submit([gpuCommands]);

  // Read buffer.
  await gpuReadBuffer.mapAsync(GPUMapMode.READ);
  console.log(connectBuffer(gpuReadBuffer, Float32Array));
}
