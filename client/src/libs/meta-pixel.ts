type FbqCommand = (
  command: "init" | "track",
  eventNameOrPixelId: string,
  params?: Record<string, unknown>,
) => void;

type MetaPixelWindow = Window & {
  fbq?: FbqCommand & {
    callMethod?: FbqCommand;
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
    push?: (...args: unknown[]) => void;
  };
  _fbq?: MetaPixelWindow["fbq"];
};

export function trackMetaPixelPageView(): void {
  if (typeof window === "undefined") return;

  const metaWindow = window as MetaPixelWindow;

  if (typeof metaWindow.fbq !== "function") return;

  metaWindow.fbq("track", "PageView");
}

type MetaPixelLeadOptions = {
  formType?: string;
};

export function trackMetaPixelLead(
  options: MetaPixelLeadOptions = {},
): void {
  if (typeof window === "undefined") return;

  const metaWindow = window as MetaPixelWindow;

  if (typeof metaWindow.fbq !== "function") return;

  metaWindow.fbq("track", "Lead", {
    form_type: options.formType ?? "consultation",
  });
}
