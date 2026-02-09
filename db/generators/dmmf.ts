import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import generatorHandler from "@prisma/generator-helper";

generatorHandler.generatorHandler({
  onManifest() {
    return {
      prettyName: "Prisma DMMF Generator",
    };
  },
  async onGenerate(options) {
    const outputFileName = options.generator.output?.value;
    if (!outputFileName) throw new Error("No output file defined for DMMF generator");

    const outputDir = join(outputFileName, "..");
    await mkdir(outputDir, { recursive: true });

    const content = `export const dmmf = ${JSON.stringify({ datamodel: { models: options.dmmf.datamodel.models } })} as const;`;

    await writeFile(outputFileName, content);
  },
});
