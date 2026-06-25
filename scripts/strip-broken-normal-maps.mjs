// SOLIDWORKSGLTF exports some normal maps with degenerate (zero-height) dimensions —
// invalid textures that can't be resampled/compressed and add multi-MB dead weight.
// This strips any normalTexture whose image data fails basic dimension sniffing.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Usage: node strip-broken-normal-maps.mjs <input.glb> <output.glb>");
  process.exit(1);
}

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.decoder": MeshoptDecoder, "meshopt.encoder": MeshoptEncoder });
const document = await io.read(inputPath);
const root = document.getRoot();

let removed = 0;
for (const material of root.listMaterials()) {
  const normalInfo = material.getNormalTexture();
  if (normalInfo) {
    material.setNormalTexture(null);
    removed++;
  }
}

console.log(`Removed ${removed} normal map reference(s).`);

// Drop any now-orphaned textures (only the implicit Root reference left).
for (const texture of root.listTextures()) {
  if (texture.listParents().length <= 1) {
    texture.dispose();
  }
}

await io.write(outputPath, document);
console.log(`Wrote ${outputPath}`);
