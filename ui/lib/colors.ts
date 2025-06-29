export type ColorState = "default" | "hover" | "active";

export type ColorClassMap = {
  default: string;
  hover?: string;
  active?: string;
  disabled?: string;
};

export type ColorScheme = {
  [key: string]: ColorClassMap;
};

const disabledTextClass = "text-gray-500"
const disabledBgClass = "bg-gray-300"

export type ColorMap = Record<string, ColorScheme>

export type ColorType = "primary" | "secondary" | "muted" | "error" | "success" | "default"

export const textColorMap: ColorScheme = {
  primary: {
    default: "text-emerald-500",
    hover: "hover:text-emerald-600",
    active: "active:text-emerald-700",
    disabled: disabledTextClass,
  },
  secondary: {
    default: "text-violet-500",
    hover: "hover:text-violet-600",
    active: "active:text-violet-700",
    disabled: disabledTextClass,
  },
  muted: {
    default: "text-gray-500",
    hover: "hover:text-gray-600",
    active: "active:text-gray-700",
    disabled: disabledTextClass,
  },
  error: {
    default: "text-red-500",
    hover: "hover:text-red-600",
    active: "active:text-red-700",
    disabled: disabledTextClass,
  },
  success: {
    default: "text-emerald-500",
    hover: "hover:text-emerald-600",
    active: "active:text-emerald-700",
    disabled: disabledTextClass,
  },
  default: {
    default: "text-gray-800"
  }
};

export const bgColorMap: ColorScheme = {
  primary: {
    default: "bg-blue-500",
    hover: "hover:bg-blue-600",
    active: "active:bg-blue-700",
    disabled: disabledBgClass,
  },
  secondary: {
    default: "bg-violet-500",
    hover: "hover:bg-violet-600",
    active: "active:bg-violet-700",
    disabled: disabledBgClass,
  },
  muted: {
    default: "bg-gray-500",
    hover: "hover:bg-gray-600",
    active: "active:bg-gray-700",
    disabled: disabledBgClass,
  },
  error: {
    default: "bg-red-500",
    hover: "hover:bg-red-600",
    active: "active:bg-red-700",
    disabled: disabledBgClass,
  },
  success: {
    default: "bg-emerald-500",
    hover: "hover:bg-emerald-600",
    active: "active:bg-emerald-700",
    disabled: disabledBgClass,
  },
  default: {
    default: "bg-gray-800"
  }
};
