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

export const colorTypes = [
  'primary',
  'secondary',
  'muted',
  'error',
  'success',
  'info',
  'default',
] as const;

export type ColorType = typeof colorTypes[number];

export const textColorMap: ColorScheme = {
  primary: {
    default: "text-emerald-500",
    hover: "hover:text-emerald-600",
    active: "active:text-emerald-700",
    disabled: disabledTextClass,
  },
  secondary: {
    default: "text-blue-500",
    hover: "hover:text-blue-600",
    active: "active:text-blue-700",
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
  info: {
    default: "text-cyan-500",
    hover: "hover:text-cyan-600",
    active: "active:text-cyan-700",
    disabled: disabledTextClass,
  },
  default: {
    default: "text-gray-500",
    hover: "hover:text-gray-900",
    active: "active:text-cyan-900",
    disabled: disabledTextClass,
  },
};

export const bgColorMap: ColorScheme = {
  primary: {
    default: "bg-blue-500",
    hover: "hover:bg-blue-600",
    active: "active:bg-blue-70",
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
  info: {
    default: "bg-cyan-500",
    hover: "hover:bg-cyan-600",
    active: "active:bg-cyan-700",
    disabled: disabledBgClass,
  },
  default: {
    default: "bg-gray-500",
    hover: "hover:bg-gray-800",
    active: "active:bg-gray-800",
    disabled: disabledBgClass,
  }
};

export const borderColorMap: ColorScheme = {
  primary: {
    default: "border-emerald-500",
    hover: "hover:border-emerald-600",
    active: "active:border-emerald-700",
    disabled: "border-gray-300",
  },
  secondary: {
    default: "border-blue-500",
    hover: "hover:border-blue-600",
    active: "active:border-blue-700",
    disabled: "border-gray-300",
  },
  muted: {
    default: "border-gray-500",
    hover: "hover:border-gray-600",
    active: "active:border-gray-700",
    disabled: "border-gray-300",
  },
  error: {
    default: "border-red-500",
    hover: "hover:border-red-600",
    active: "active:border-red-700",
    disabled: "border-gray-300",
  },
  success: {
    default: "border-emerald-500",
    hover: "hover:border-emerald-600",
    active: "active:border-emerald-700",
    disabled: "border-gray-300",
  },
  info: {
    default: "border-cyan-500",
    hover: "hover:border-cyan-600",
    active: "active:border-cyan-700",
    disabled: "border-gray-300",
  },
  default: {
    default: "border-gray-800",
    hover: "hover:border-gray-900",
    active: "active:border-gray-900",
    disabled: "border-gray-300",
  },
};
