# Library Dependency Resolver

## Project Description

A TypeScript-based utility for resolving and managing software library dependencies, capable of parsing complex dependency graphs and expanding them to include transitive dependencies.

## Prerequisites

- Node.js (version 14.0.0 or higher)
- npm (Node Package Manager)

## Cloning the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/library-dependency-resolver.git

# Navigate to the project directory
cd library-dependency-resolver

# Install dependencies
npm install
```

## Running the Project

### 1. Create a Dependency File

Create a text file (e.g., `dependencies.txt`) with your library dependencies. Example:

```
A depends on B C
B depends on D
C has no dependencies
```

### 2. Run the Dependency Resolver

```bash
# Using npm start
npm start -- path/to/dependencies.txt

# Alternatively, if you want to use node directly
npx ts-node src/index.ts path/to/dependencies.txt
```

### Example Usage

```bash
# Example with sample dependencies
npm start -- ./dependencies.txt
```

## Available Scripts

- `npm start`: Run the dependency resolver
- `npm test`: Run test suite
- `npm run build`: Compile TypeScript to JavaScript
- `npm run lint`: Run ESLint for code quality checks
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate test coverage report

## Dependency File Format

### Rules for Dependency Declarations

- Use format: `LibraryName depends on Dependency1 Dependency2`
- Use `LibraryName has no dependencies` for libraries without dependencies
- Supports simple and transitive dependencies
- Handles circular dependencies

### Example Dependency File

```
A depends on B C
B depends on D
C has no dependencies
D depends on E
```

## Error Handling

The resolver provides robust error handling:

- Invalid file paths
- Incorrectly formatted dependency lines
- File read errors

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Building the Project

```bash
# Compile TypeScript to JavaScript
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/library-dependency-resolver](https://github.com/yourusername/library-dependency-resolver)
