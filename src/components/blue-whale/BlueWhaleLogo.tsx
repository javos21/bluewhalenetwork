import { forwardRef, useMemo } from "react";
import fullLogoSvg from "../../../blue-whale-svg-assets/blue-whale-logo-animatable.svg?raw";
import markSvg from "../../../blue-whale-svg-assets/blue-whale-mark-animatable.svg?raw";
import refinedSvg from "../../../blue-whale-svg-assets/blue-whale-logo-refined.svg?raw";

type BlueWhaleLogoProps = {
  className?: string;
  instanceId: string;
  variant?: "full" | "mark";
  decorative?: boolean;
  artwork?: "original" | "refined";
};

function namespaceSvg(svg: string, prefix: string) {
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "-");
  const ids = Array.from(svg.matchAll(/id="([^"]+)"/g), (match) => match[1]);
  let namespaced = svg.replace(/^<\?xml[^>]*>\s*/i, "");

  for (const id of ids) {
    namespaced = namespaced
      .replaceAll(`url(#${id})`, `url(#${safePrefix}-${id})`)
      .replaceAll(`id="${id}"`, `id="${safePrefix}-${id}" data-bw-id="${id}"`);
  }

  namespaced = namespaced.replace(
    /aria-labelledby="title desc"/,
    `aria-labelledby="${safePrefix}-title ${safePrefix}-desc"`,
  );

  return namespaced;
}

export const BlueWhaleLogo = forwardRef<HTMLDivElement, BlueWhaleLogoProps>(
  function BlueWhaleLogo(
    { className = "", instanceId, variant = "full", decorative = true, artwork = "original" },
    ref,
  ) {
    const markup = useMemo(
      () => {
        let source = artwork === "refined" ? refinedSvg : variant === "full" ? fullLogoSvg : markSvg;
        if (artwork === "refined" && variant === "mark") {
          source = source.replace('viewBox="0 0 500 500"', 'viewBox="25 20 450 270"')
            .replace(/<g id="blue-whale-wordmark"[\s\S]*?<\/g>/, "")
            .replace(/<g id="consulting-wordmark"[\s\S]*?<\/g>/, "");
        }
        return namespaceSvg(source, instanceId);
      },
      [instanceId, variant, artwork],
    );

    return (
      <div
        ref={ref}
        className={`blue-whale-svg ${className}`.trim()}
        aria-hidden={decorative || undefined}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  },
);
