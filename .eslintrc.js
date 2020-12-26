module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        // "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "eslint-config-prettier"
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    // don't link top-level JS files, they are outside the TS project
    ignorePatterns: ["*.js"]
};
