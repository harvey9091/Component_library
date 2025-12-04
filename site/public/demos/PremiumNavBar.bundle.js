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
  var import_react2 = __toESM(__require("react"));

  // components/PremiumNavBar/index.tsx
  var import_react = __toESM(__require("react"));
  var import_lucide_react = __require("lucide-react");
  var PremiumNavBar = ({ activeTabId, onTabChange }) => {
    const tabs = (0, import_react.useMemo)(() => [
      { id: "home", icon: import_lucide_react.Home, label: "Home" },
      { id: "heart", icon: import_lucide_react.Heart, label: "Likes" },
      { id: "add", icon: import_lucide_react.Plus, label: "Create" },
      { id: "profile", icon: import_lucide_react.User, label: "Profile" },
      { id: "notifications", icon: import_lucide_react.Bell, label: "Notify" }
    ], []);
    const [activeIndex, setActiveIndex] = (0, import_react.useState)(0);
    (0, import_react.useEffect)(() => {
      const index = tabs.findIndex((tab) => tab.id === activeTabId);
      if (index !== -1) setActiveIndex(index);
    }, [activeTabId, tabs]);
    return /* @__PURE__ */ import_react.default.createElement("nav", { className: "relative w-full max-w-[400px]", role: "navigation" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative flex h-20 w-full items-center justify-between rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-60" }), /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        className: "absolute inset-y-0 left-0 pointer-events-none transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
        style: {
          width: `${100 / tabs.length}%`,
          transform: `translateX(${activeIndex * 100}%)`
        }
      },
      /* @__PURE__ */ import_react.default.createElement("div", { className: "relative w-full h-full flex flex-col items-center justify-end" }, /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          className: "w-full h-full bg-gradient-to-t from-red-600/20 via-red-500/5 to-transparent opacity-100 blur-md"
        }
      ), /* @__PURE__ */ import_react.default.createElement("div", { className: "absolute bottom-0 h-[2px] w-8 rounded-full bg-red-500 shadow-[0_-2px_15px_2px_rgba(239,68,68,0.8)] z-20" }))
    ), /* @__PURE__ */ import_react.default.createElement("div", { className: "relative z-20 flex w-full h-full justify-between items-center" }, tabs.map((tab, index) => {
      const isActive = activeTabId === tab.id;
      const Icon = tab.icon;
      return /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          key: tab.id,
          onClick: () => onTabChange(tab.id),
          className: "group relative flex flex-1 items-center justify-center outline-none h-full",
          "aria-label": tab.label
        },
        /* @__PURE__ */ import_react.default.createElement(
          "div",
          {
            className: "relative flex flex-col items-center justify-center transition-all duration-300 ease-out"
          },
          /* @__PURE__ */ import_react.default.createElement(
            Icon,
            {
              size: 26,
              strokeWidth: isActive ? 2 : 1.5,
              className: `

                      relative z-10 transition-colors duration-300

                      ${isActive ? "text-white drop-shadow-[0_0_12px_rgba(239,68,68,1)]" : "text-white/20 group-hover:text-red-400"}

                    `
            }
          )
        )
      );
    }))));
  };
  var index_default = PremiumNavBar;

  // components/PremiumNavBar/demo.tsx
  var PremiumNavBarDemo = () => {
    const [activeTab, setActiveTab] = (0, import_react2.useState)("home");
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4" }, /* @__PURE__ */ import_react2.default.createElement("h1", { className: "text-2xl font-bold text-white mb-8" }, "Premium Navigation Bar Demo"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ import_react2.default.createElement(
      index_default,
      {
        activeTabId: activeTab,
        onTabChange: setActiveTab
      }
    )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "mt-8 text-white" }, /* @__PURE__ */ import_react2.default.createElement("p", null, "Active Tab: ", activeTab)));
  };
  var demo_default = PremiumNavBarDemo;
  return __toCommonJS(demo_exports);
})();
