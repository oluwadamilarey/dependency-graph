import * as path from "path";
import DependencyResolver from "./lib/dependency-resolver";

function main() {
  if (process.argv.length < 3) {
    console.error("Usage: npm start -- <dependency-file-path>");
    process.exit(1);
  }

  const filePath = path.resolve(process.argv[2]);

  try {
    const resolver = new DependencyResolver();
    const fullDependencies = resolver.processDependencies(filePath);
    console.log(fullDependencies.join("\n"));
  } catch (error) {
    console.error(
      `Error processing dependencies: ${
        error instanceof Error ? error.message : error
      }`
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default main;
