import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";

const [, , inputPath] = process.argv;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
const document = await io.read(inputPath);

for (const node of document.getRoot().listNodes()) {
  const mesh = node.getMesh();
  console.log(`${node.getName() || "(unnamed)"} | mesh=${mesh ? mesh.getName() || "(unnamed)" : "none"} | children=${node.listChildren().length}`);
}
