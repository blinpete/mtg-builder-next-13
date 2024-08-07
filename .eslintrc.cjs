/**
  https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js
  https://nextjs.org/docs/pages/building-your-application/configuring/eslint#core-web-vitals
  https://github.com/feature-sliced/eslint-config
  https://github.com/javierbrea/eslint-plugin-boundaries
  https://github.com/yunglocokid/FSD-Pure-Next.js-Template/blob/master/.eslintrc.json
*/
module.exports = {
  root: true,
  extends: [
    "plugin:boundaries/recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier",
  ],

  plugins: ["react-refresh", "@typescript-eslint", "boundaries"],

  // FSD, to check boundaries (eslint-plugin-boundaries)
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },

    "boundaries/include": ["src/**/*"],
    "boundaries/elements": [
      {
        type: "app",
        pattern: "1-app",
      },
      {
        type: "pages",
        pattern: "2-pages/*",
        capture: ["page"],
      },
      {
        type: "widgets",
        pattern: "3-widgets/*",
        capture: ["widget"],
      },
      {
        type: "features",
        pattern: "4-features/*",
        capture: ["feature"],
      },
      {
        type: "entities",
        pattern: "5-entities/*",
        capture: ["entity"],
      },
      {
        type: "shared",
        pattern: "6-shared/*",
        capture: ["segment"],
      },
    ],
  },

  rules: {
    "react-refresh/only-export-components": 0,

    "import/no-unresolved": "error",
    "import/newline-after-import": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": "error",

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",

    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },

        // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#distinctgroup-boolean
        distinctGroup: false,

        pathGroups: ["app", "pages", "widgets", "features", "entities", "shared"].map(layer => ({
          pattern: `**/?(*)@${layer}{,/**}`,
          group: "internal",
          position: "after",
        })),
        pathGroupsExcludedImportTypes: ["builtin"],

        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "index",
          "sibling",
          "object",
          "unknown",
          "type",
        ],
      },
    ],

    "boundaries/entry-point": [
      2,
      {
        default: "disallow",
        rules: [
          {
            target: [["shared", { segment: "*" }]],
            allow: "index.ts",
          },
          {
            target: [["shared", { segment: "lib" }]],
            allow: "*.(ts|tsx)",
          },
          {
            target: [
              [
                "shared",
                {
                  segment: "ui", // ("ui"|"constants")
                },
              ],
            ],
            allow: "**",
          },
          {
            target: ["app", "pages", "widgets", "features", "entities"],
            allow: "index.(ts|tsx)",
          },
        ],
      },
    ],
    "boundaries/element-types": [
      2,
      {
        default: "allow",
        message: "${file.type} is not allowed to import (${dependency.type})",
        rules: [
          {
            from: ["shared"],
            disallow: ["app", "pages", "widgets", "features", "entities"],
            message: "Shared module must not import upper layers (${dependency.type})",
          },
          {
            from: ["entities"],
            message: "Entity must not import upper layers (${dependency.type})",
            disallow: ["app", "pages", "widgets", "features"],
          },
          {
            from: ["entities"],
            message: "Entity must not import other entity",
            disallow: [
              [
                "entities",
                {
                  entity: "!${entity}",
                },
              ],
            ],
          },
          {
            from: ["features"],
            message: "Feature must not import upper layers (${dependency.type})",
            disallow: ["app", "pages", "widgets"],
          },
          {
            from: ["features"],
            message: "Feature must not import other feature",
            disallow: [
              [
                "features",
                {
                  feature: "!${feature}",
                },
              ],
            ],
          },
          {
            from: ["widgets"],
            message: "Feature must not import upper layers (${dependency.type})",
            disallow: ["app", "pages"],
          },
          {
            from: ["widgets"],
            message: "Widget must not import other widget",
            disallow: [
              [
                "widgets",
                {
                  widget: "!${widget}",
                },
              ],
            ],
          },
          {
            from: ["pages"],
            message: "Page must not import upper layers (${dependency.type})",
            disallow: ["app"],
          },
          {
            from: ["pages"],
            message: "Page must not import other page",
            disallow: [
              [
                "pages",
                {
                  page: "!${page}",
                },
              ],
            ],
          },
        ],
      },
    ],

    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "separate-type-imports",
      },
    ],
  },
}
