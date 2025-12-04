# Component Library

A reusable component library project.

## How to Add a Component

1. Create a new folder in the `components/` directory
2. Add your component files
3. Optionally, add a `meta.json` file with component metadata

## How to Generate Catalog

Run the following command to generate the component catalog:

```bash
npm run generate-catalog
```

This will scan all components and create/update the catalog.json file.

## How to Run the Site

To start the development server:

```bash
npm run site:dev
```

To build the site for production:

```bash
npm run site:build
```