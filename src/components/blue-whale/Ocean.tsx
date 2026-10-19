export function Ocean() {
  return (
    <svg className="hero-ocean" viewBox="0 0 1600 360" preserveAspectRatio="none" aria-hidden="true">
      <path className="ocean-layer ocean-layer--back" fill="#a5c9d2" d="M-200 120C80 10 280 35 540 110S960 155 1210 65S1600 35 1800 95V400H-200Z" />
      <path className="ocean-layer ocean-layer--middle" fill="#6197ad" d="M-200 145C80 185 310 165 565 90S1030 80 1280 150S1640 160 1800 110V400H-200Z" />
      <path className="ocean-layer ocean-layer--front" fill="#03466e" d="M-200 195C70 120 320 140 600 185S1060 210 1330 140S1660 135 1800 170V400H-200Z" />
    </svg>
  );
}
