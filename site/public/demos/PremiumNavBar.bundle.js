var DemoComponent = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // components/PremiumNavBar/demo.tsx
  var demo_exports = {};
  __export(demo_exports, {
    default: () => demo_default
  });
  var import_react4 = __toESM(__require("react"));

  // components/PremiumNavBar/index.tsx
  var import_react3 = __toESM(__require("react"));

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var import_react2 = __require("react");

  // node_modules/lucide-react/dist/esm/shared/src/utils.js
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  var toCamelCase = (string) => string.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
  );
  var toPascalCase = (string) => {
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var import_react = __require("react");

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var Icon = (0, import_react.forwardRef)(
    ({
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => (0, import_react.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var createLucideIcon = (iconName, iconNode) => {
    const Component = (0, import_react2.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react2.createElement)(Icon, {
        ref,
        iconNode,
        className: mergeClasses(
          `lucide-${toKebabCase(toPascalCase(iconName))}`,
          `lucide-${iconName}`,
          className
        ),
        ...props
      })
    );
    Component.displayName = toPascalCase(iconName);
    return Component;
  };

  // node_modules/lucide-react/dist/esm/icons/bell.js
  var __iconNode = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        key: "11g9vi"
      }
    ]
  ];
  var Bell = createLucideIcon("bell", __iconNode);

  // node_modules/lucide-react/dist/esm/icons/heart.js
  var __iconNode2 = [
    [
      "path",
      {
        d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        key: "mvr1a0"
      }
    ]
  ];
  var Heart = createLucideIcon("heart", __iconNode2);

  // node_modules/lucide-react/dist/esm/icons/house.js
  var __iconNode3 = [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1"
      }
    ]
  ];
  var House = createLucideIcon("house", __iconNode3);

  // node_modules/lucide-react/dist/esm/icons/plus.js
  var __iconNode4 = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ];
  var Plus = createLucideIcon("plus", __iconNode4);

  // node_modules/lucide-react/dist/esm/icons/user.js
  var __iconNode5 = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ];
  var User = createLucideIcon("user", __iconNode5);

  // components/PremiumNavBar/index.tsx
  var PremiumNavBar = ({
    activeTabId = "home",
    onTabChange = () => {
    }
  }) => {
    const tabs = (0, import_react3.useMemo)(() => [
      { id: "home", icon: House, label: "Home" },
      { id: "heart", icon: Heart, label: "Likes" },
      { id: "add", icon: Plus, label: "Create" },
      { id: "profile", icon: User, label: "Profile" },
      { id: "notifications", icon: Bell, label: "Notify" }
    ], []);
    const [activeIndex, setActiveIndex] = (0, import_react3.useState)(0);
    (0, import_react3.useEffect)(() => {
      const index = tabs.findIndex((tab) => tab.id === activeTabId);
      if (index !== -1) setActiveIndex(index);
    }, [activeTabId, tabs]);
    return /* @__PURE__ */ import_react3.default.createElement("nav", { className: "relative w-full max-w-[400px]", role: "navigation" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "relative flex h-20 w-full items-center justify-between rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] overflow-hidden" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-60" }), /* @__PURE__ */ import_react3.default.createElement(
      "div",
      {
        className: "absolute inset-y-0 left-0 pointer-events-none transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
        style: {
          width: `${100 / tabs.length}%`,
          transform: `translateX(${activeIndex * 100}%)`
        }
      },
      /* @__PURE__ */ import_react3.default.createElement("div", { className: "relative w-full h-full flex flex-col items-center justify-end" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "w-full h-full bg-gradient-to-t from-red-600/20 via-red-500/5 to-transparent opacity-100 blur-md" }), /* @__PURE__ */ import_react3.default.createElement("div", { className: "absolute bottom-0 h-[2px] w-8 rounded-full bg-red-500 shadow-[0_-2px_15px_2px_rgba(239,68,68,0.8)] z-20" }))
    ), /* @__PURE__ */ import_react3.default.createElement("div", { className: "relative z-20 flex w-full h-full justify-between items-center" }, tabs.map((tab, index) => {
      const isActive = activeTabId === tab.id;
      const Icon2 = tab.icon;
      return /* @__PURE__ */ import_react3.default.createElement(
        "button",
        {
          key: tab.id,
          onClick: () => onTabChange && onTabChange(tab.id),
          className: "group relative flex flex-1 items-center justify-center outline-none h-full",
          "aria-label": tab.label,
          type: "button"
        },
        /* @__PURE__ */ import_react3.default.createElement("div", { className: "relative flex flex-col items-center justify-center transition-all duration-300 ease-out" }, /* @__PURE__ */ import_react3.default.createElement(
          Icon2,
          {
            className: `
                      relative z-10 transition-colors duration-300
                      ${isActive ? "text-white drop-shadow-[0_0_12px_rgba(239,68,68,1)]" : "text-white/20 group-hover:text-red-400"}
                    `,
            width: 26,
            height: 26,
            strokeWidth: isActive ? 2 : 1.5
          }
        ))
      );
    }))));
  };
  var index_default = PremiumNavBar;

  // components/PremiumNavBar/demo.tsx
  var PremiumNavBarDemo = () => {
    const [activeTab, setActiveTab] = (0, import_react4.useState)("home");
    return /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4" }, /* @__PURE__ */ import_react4.default.createElement("h1", { className: "text-2xl font-bold text-white mb-8" }, "Premium Navigation Bar Demo"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ import_react4.default.createElement(
      index_default,
      {
        activeTabId: activeTab,
        onTabChange: setActiveTab
      }
    )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-8 text-white" }, /* @__PURE__ */ import_react4.default.createElement("p", null, "Active Tab: ", activeTab)));
  };
  var demo_default = PremiumNavBarDemo;
  return __toCommonJS(demo_exports);
})();
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/bell.js:
lucide-react/dist/esm/icons/heart.js:
lucide-react/dist/esm/icons/house.js:
lucide-react/dist/esm/icons/plus.js:
lucide-react/dist/esm/icons/user.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.555.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
