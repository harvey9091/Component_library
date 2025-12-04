// This shim makes React and ReactDOM available as globals for components that import them
// It's used by esbuild's inject option to replace import statements with global references

export const React = globalThis.ReactLibrary ? (typeof globalThis.ReactLibrary === 'function' ? globalThis.ReactLibrary() : globalThis.ReactLibrary) : globalThis.React;
export const ReactDOM = globalThis.ReactDOMLibrary ? (typeof globalThis.ReactDOMLibrary === 'function' ? globalThis.ReactDOMLibrary() : globalThis.ReactDOMLibrary) : globalThis.ReactDOM;

// Also make them available on globalThis for direct access
globalThis.React = React;
globalThis.ReactDOM = ReactDOM;