declare let navigator: Navigator & { gpu: WebGPU.GPU };

export async function createDevice(): Promise<WebGPU.Device | undefined> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return;
  return adapter.requestDevice();
}
