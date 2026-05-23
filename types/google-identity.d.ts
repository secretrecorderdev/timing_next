export {};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: GoogleIdentityInitializeOptions) => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleIdentityButtonOptions
          ) => void;
          prompt: (momentListener?: (notification: unknown) => void) => void;
          cancel: () => void;
        };
      };
    };
  }

  interface GoogleIdentityCredentialResponse {
    credential: string;
    select_by?: string;
    clientId?: string;
  }

  interface GoogleIdentityInitializeOptions {
    client_id: string;
    callback: (response: GoogleIdentityCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    ux_mode?: "popup" | "redirect";
    context?: "signin" | "signup" | "use";
  }

  interface GoogleIdentityButtonOptions {
    type?: "standard" | "icon";
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    logo_alignment?: "left" | "center";
    width?: string | number;
    locale?: string;
  }
}
