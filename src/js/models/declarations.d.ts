/* eslint-disable @typescript-eslint/no-empty-interface */
declare enum GPUBufferUsage {
  MAP_WRITE,
  COPY_SRC,
  COPY_DST,
  MAP_READ,
  STORAGE,
}

declare enum GPUMapMode {
  READ,
  WRITE,
}

declare enum GPUShaderStage {
  COMPUTE,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WebGPU {
  interface EncoderCommands {}

  interface PassEncoder {
    setPipeline: (pipeline: ComputePipeline) => void;
    setBindGroup: (offset: number, bindGroup: BindGroup) => void;
    dispatch: (xSize: number, ySize: number) => void;
    endPass: () => void;
  }

  interface Encoder {
    copyBufferToBuffer: (
      srcBuffer: Buffer,
      srcOffset: number,
      dstBuffer: Buffer,
      dstOffset: number,
      size: number,
    ) => void;
    finish: () => EncoderCommands;
    beginComputePass: () => PassEncoder;
  }

  interface BufferOptions {
    mappedAtCreation?: boolean;
    size: number;
    usage: GPUBufferUsage;
  }

  interface Buffer {
    getMappedRange: () => number;
    unmap: () => void;
    mapAsync: (mode: GPUMapMode) => Promise<void>;
  }

  interface DeviceQueue {
    submit: (encodedCommands: EncoderCommands[]) => void;
  }

  interface BindGroupLayoutEntry {
    binding: number;
    visibility: GPUShaderStage;
    buffer: {
      type: 'read-only-storage' | 'storage';
    };
  }

  interface BindGroupLayoutOptions {
    entries: BindGroupLayoutEntry[];
  }

  interface BindGroupLayout {}

  interface BindGroupEntry {
    binding: number;
    resource: {
      buffer: Buffer;
    };
  }

  interface BindGroupOptions {
    layout: BindGroupLayout;
    entries: BindGroupEntry[];
  }

  interface BindGroup {}

  interface ShaderModuleOptions {
    code: any;
  }

  interface ShaderModule {}

  interface PipelineLayoutOptions {
    bindGroupLayouts: BindGroupLayout[];
  }

  interface PipelineLayout {}

  interface ComputePipelineOptions {
    computeStage: {
      module: ShaderModule;
      entryPoint: string;
    };
  }

  interface ComputePipeline {
    getBindGroupLayout: (index: number) => BindGroupLayout;
  }

  interface Device {
    createBufferMapped: (options: BufferOptions) => Buffer;
    createBuffer: (options: BufferOptions) => Buffer;
    createCommandEncoder: () => Encoder;
    queue: DeviceQueue;
    createBindGroupLayout: (options: BindGroupLayoutOptions) => BindGroupLayout;
    createBindGroup: (options: BindGroupOptions) => BindGroup;
    createShaderModule: (options: ShaderModuleOptions) => ShaderModule;
    createPipelineLayout: (options: PipelineLayoutOptions) => PipelineLayout;
    createComputePipeline: (options: ComputePipelineOptions) => ComputePipeline;
  }

  interface Adapter {
    requestDevice: () => Promise<Device>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GPU {
    requestAdapter: () => Promise<Adapter | undefined>;
  }
}
