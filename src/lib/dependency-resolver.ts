import * as fs from "fs";

export default class DependencyResolver {
  private directDependencies: Map<string, Set<string>> = new Map();

  /**
   * Parse a single dependency line
   * @param line Dependency line to parse
   */
  private parseDependencyLine(line: string): void {
    const parts = line.trim().split(/\s+/);

    // Special handling for "has no dependencies"
    if (
      parts.length === 4 &&
      parts[1] === "has" &&
      parts[2] === "no" &&
      parts[3] === "dependencies"
    ) {
      this.directDependencies.set(parts[0], new Set());
      return;
    }

    // Validate standard dependency line format
    if (parts.length < 3 || parts[1] !== "depends" || parts[2] !== "on") {
      throw new Error(`Invalid dependency line format: ${line}`);
    }

    const library = parts[0];
    const dependencies = parts.slice(3);

    // Store direct dependencies
    this.directDependencies.set(library, new Set(dependencies));
  }

  /**
   * Recursively resolve full dependencies
   * @param library Starting library
   * @param visited Set to prevent infinite recursion
   * @returns Full set of dependencies
   */
  private resolveFullDependencies(
    library: string,
    visited = new Set<string>()
  ): Set<string> {
    // Prevent infinite recursion and self-references
    if (visited.has(library)) return new Set();
    visited.add(library);

    const dependencies = new Set<string>();
    const directDeps = this.directDependencies.get(library) || new Set();

    // Collect direct dependencies first
    for (const dep of directDeps) {
      if (dep !== library) {
        dependencies.add(dep);
      }
    }

    // Recursively resolve transitive dependencies
    for (const dep of directDeps) {
      if (dep !== library) {
        const transitiveDeps = this.resolveFullDependencies(
          dep,
          new Set(visited)
        );

        for (const transitiveDep of transitiveDeps) {
          if (transitiveDep !== library) {
            dependencies.add(transitiveDep);
          }
        }
      }
    }

    return new Set([...dependencies].sort());
  }

  /**
   * Read and process dependency file
   * @param filePath Path to dependency file
   * @returns Array of original input lines
   */
  private readDependencyFile(filePath: string): string[] {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return fileContent.trim().split("\n");
    } catch (error) {
      throw new Error(
        `Error reading file: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  /**
   * Compute full dependencies while preserving input order
   * @param inputLines Original input lines
   * @returns Array of full dependency lines
   */
  private computeFullDependencies(inputLines: string[]): string[] {
    // Reset internal state
    this.directDependencies.clear();

    // Parse all lines to build direct dependencies
    inputLines.forEach((line) => this.parseDependencyLine(line));

    // Compute full dependencies maintaining input order
    return inputLines.map((line) => {
      const library = line.split(/\s+/)[0];

      // Handle "has no dependencies" case
      if (line.includes("has no dependencies")) {
        return line;
      }

      const fullDependencies = this.resolveFullDependencies(library);

      return fullDependencies.size > 0
        ? `${library} depends on ${Array.from(fullDependencies).join(" ")}`
        : `${library} has no dependencies`;
    });
  }

  /**
   * Main method to process dependency file
   * @param filePath Input file path
   * @returns Full dependency information
   */
  processDependencies(filePath: string): string[] {
    const inputLines = this.readDependencyFile(filePath);
    return this.computeFullDependencies(inputLines);
  }
}
