export default {
  files: "test/**/*.test.js",
  nodeResolve: true,
  coverageConfig: {
    report: true,
    reportDir: "coverage",
    threshold: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
    include: ["src/**/*.js"],
  },
};
