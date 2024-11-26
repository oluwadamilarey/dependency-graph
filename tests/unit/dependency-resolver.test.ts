import * as fs from "fs";
import * as path from "path";
import DependencyResolver from "../../src/lib/dependency-resolver";

describe("DependencyResolver", () => {
  let resolver: DependencyResolver;

  beforeEach(() => {
    resolver = new DependencyResolver();
  });

  // Helper function to create temporary test files
  const createTempFile = (content: string): string => {
    const tempFilePath = path.join(__dirname, "temp-test-file.txt");
    fs.writeFileSync(tempFilePath, content);
    return tempFilePath;
  };

  // Clean up temporary files after tests
  const cleanupTempFile = (filePath: string) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };

  describe("Basic Dependency Resolution", () => {
    it("should resolve simple dependencies", () => {
      const input = "X depends on Y\nY depends on Z";
      const tempFile = createTempFile(input);

      const result = resolver.processDependencies(tempFile);

      expect(result).toEqual(["X depends on Y Z", "Y depends on Z"]);

      cleanupTempFile(tempFile);
    });
  });

  describe("Complex Dependency Scenarios", () => {
    it("should handle transitive dependencies", () => {
      const input =
        "Y depends on Z\nA depends on Q R S\nX depends on Y Z\nZ depends on A B";
      const tempFile = createTempFile(input);

      const result = resolver.processDependencies(tempFile);

      expect(result).toEqual([
        "Y depends on Z A B",
        "A depends on Q R S",
        "X depends on Y Z A B",
        "Z depends on A B",
      ]);

      cleanupTempFile(tempFile);
    });

    it("should resolve deeply nested dependencies", () => {
      const input =
        "A depends on B C\nB depends on C E\nC depends on G\nD depends on A\nE depends on F\nF depends on H";
      const tempFile = createTempFile(input);

      const result = resolver.processDependencies(tempFile);

      expect(result).toEqual([
        "A depends on B C E F G H",
        "B depends on C E F G H",
        "C depends on G",
        "D depends on A B C E F G H",
        "E depends on F H",
        "F depends on H",
      ]);

      cleanupTempFile(tempFile);
    });
  });

  describe("Edge Cases", () => {
    it("should handle circular dependencies", () => {
      const input = "A depends on B\nB depends on A";
      const tempFile = createTempFile(input);

      const result = resolver.processDependencies(tempFile);

      expect(result).toEqual(["A depends on B", "B depends on A"]);

      cleanupTempFile(tempFile);
    });

    it("should handle libraries with no dependencies", () => {
      const input =
        "A depends on B\nB has no dependencies\nC has no dependencies";
      const tempFile = createTempFile(input);

      const result = resolver.processDependencies(tempFile);

      expect(result).toEqual([
        "A depends on B",
        "B has no dependencies",
        "C has no dependencies",
      ]);

      cleanupTempFile(tempFile);
    });
  });

  describe("Error Handling", () => {
    it("should throw error for invalid dependency line", () => {
      const input = "X invalid format";
      const tempFile = createTempFile(input);

      expect(() => {
        resolver.processDependencies(tempFile);
      }).toThrow("Invalid dependency line format");

      cleanupTempFile(tempFile);
    });

    it("should throw error for non-existent file", () => {
      expect(() => {
        resolver.processDependencies("/path/to/non/existent/file");
      }).toThrow("Error reading file");
    });
  });
});
