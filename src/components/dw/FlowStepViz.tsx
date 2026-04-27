export type FlowVizKind = "url" | "build" | "edit" | "publish";

export const FlowStepViz = ({ kind }: { kind: FlowVizKind }) => {
  if (kind === "url") return <UrlStep />;
  if (kind === "build") return <BuildStep />;
  if (kind === "edit") return <EditStep />;
  if (kind === "publish") return <PublishStep />;
  return null;
};

const SAMPLES = [
  "amazon.com/dp/B0CK7M…",
  "alibaba.com/products/…",
  "tiktokshop.com/listing/…",
  "shopify.com/products/…",
];

const UrlStep = () => (
  <div className="viz-card">
    <div className="viz-noise" />
    <div className="browser">
      <div className="browser-chrome">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <div className="browser-tab">
        <span className="tab-favicon" />
        <span className="tab-title">New tab</span>
      </div>
      <div className="browser-url">
        <svg viewBox="0 0 12 12" width="10" height="10" className="lock">
          <path
            d="M3 5.5V4a3 3 0 0 1 6 0v1.5"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <rect
            x="2"
            y="5.5"
            width="8"
            height="5.5"
            rx="0.8"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
        <div className="url-typer">
          {SAMPLES.map((s, i) => (
            <span key={i} className="url-line" style={{ animationDelay: `${i * 4.4}s` }}>
              {s}
            </span>
          ))}
        </div>
        <span className="caret" />
      </div>
    </div>
    <style jsx>{`
      .viz-card {
        position: relative;
        height: 116px;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(
          180deg,
          color-mix(in oklab, var(--dw-surface2) 100%, transparent),
          color-mix(in oklab, var(--dw-surface) 96%, transparent)
        );
        border: 1px solid var(--dw-border);
        overflow: hidden;
        padding: 14px 14px 12px;
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--dw-text) 6%, transparent),
          0 18px 40px -28px rgba(0, 0, 0, 0.6);
      }
      .viz-noise {
        position: absolute;
        inset: 0;
        opacity: 0.4;
        pointer-events: none;
        background-image: radial-gradient(
          color-mix(in oklab, var(--dw-text) 4%, transparent) 1px,
          transparent 1px
        );
        background-size: 6px 6px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
      }
      .browser {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
      }
      .browser-chrome {
        display: flex;
        gap: 5px;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: color-mix(in oklab, var(--dw-text-muted) 35%, transparent);
      }
      .browser-tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        align-self: flex-start;
        background: var(--dw-bg);
        border: 1px solid var(--dw-border);
        border-bottom: none;
        border-radius: 5px 5px 0 0;
        padding: 4px 9px 4px 7px;
        margin-bottom: -1px;
      }
      .tab-favicon {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: color-mix(in oklab, var(--dw-accent) 55%, var(--dw-text-muted));
      }
      .tab-title {
        font-size: 9.5px;
        color: var(--dw-text-muted);
        letter-spacing: 0.01em;
      }
      .browser-url {
        position: relative;
        display: flex;
        align-items: center;
        gap: 7px;
        background: var(--dw-bg);
        border: 1px solid var(--dw-border);
        border-radius: 6px;
        padding: 7px 10px;
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--dw-text-dim);
        overflow: hidden;
        flex: 1;
      }
      .lock {
        color: var(--dw-text-muted);
        flex-shrink: 0;
      }
      .url-typer {
        position: relative;
        flex: 1;
        height: 14px;
        overflow: hidden;
      }
      .url-line {
        position: absolute;
        inset: 0;
        white-space: nowrap;
        opacity: 0;
        color: var(--dw-text);
        animation: url-cycle 17.6s linear infinite;
      }
      @keyframes url-cycle {
        0% {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
        }
        4% {
          opacity: 1;
        }
        18% {
          clip-path: inset(0 0 0 0);
        }
        22% {
          clip-path: inset(0 0 0 0);
        }
        25% {
          clip-path: inset(0 0 0 100%);
          opacity: 0;
        }
        100% {
          opacity: 0;
          clip-path: inset(0 0 0 100%);
        }
      }
      .caret {
        width: 1.5px;
        height: 14px;
        background: var(--dw-accent);
        animation: caret 1s steps(2) infinite;
        flex-shrink: 0;
      }
      @keyframes caret {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
    `}</style>
  </div>
);

const SECTIONS = ["Hero", "Product", "Bundles"];

const BuildStep = () => (
  <div className="viz-card">
    <div className="viz-noise" />
    <div className="build-pane">
      <div className="build-tray">
        {SECTIONS.map((label, i) => (
          <div key={label} className="tray-item" style={{ animationDelay: `${i * 1.6}s` }}>
            <span className="tray-thumb" />
            <span className="tray-label">{label}</span>
          </div>
        ))}
      </div>
      <div className="build-canvas">
        {SECTIONS.map((label, i) => (
          <div
            key={label}
            className="canvas-section"
            style={{ animationDelay: `${0.6 + i * 1.6}s` }}
          >
            <span className="canvas-bar" />
          </div>
        ))}
        <Cursor className="build-cursor" />
      </div>
    </div>
    <style jsx>{`
      .viz-card {
        position: relative;
        height: 116px;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(
          180deg,
          color-mix(in oklab, var(--dw-surface2) 100%, transparent),
          color-mix(in oklab, var(--dw-surface) 96%, transparent)
        );
        border: 1px solid var(--dw-border);
        overflow: hidden;
        padding: 10px;
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--dw-text) 6%, transparent),
          0 18px 40px -28px rgba(0, 0, 0, 0.6);
      }
      .viz-noise {
        position: absolute;
        inset: 0;
        opacity: 0.4;
        pointer-events: none;
        background-image: radial-gradient(
          color-mix(in oklab, var(--dw-text) 4%, transparent) 1px,
          transparent 1px
        );
        background-size: 6px 6px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
      }
      .build-pane {
        position: relative;
        height: 100%;
        display: grid;
        grid-template-columns: 38% 1fr;
        gap: 8px;
      }
      .build-tray {
        background: var(--dw-bg);
        border: 1px solid var(--dw-border);
        border-radius: 6px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .tray-item {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 3px 5px;
        border-radius: 4px;
        animation: tray-pickup 4.8s ease-in-out infinite;
      }
      .tray-thumb {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: color-mix(in oklab, var(--dw-text-muted) 50%, transparent);
      }
      .tray-label {
        font-size: 9px;
        color: var(--dw-text-muted);
        letter-spacing: 0.02em;
      }
      .build-canvas {
        position: relative;
        background: var(--dw-bg);
        border: 1px solid var(--dw-border);
        border-radius: 6px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden;
      }
      .canvas-section {
        height: 14px;
        background: color-mix(in oklab, var(--dw-surface2) 100%, transparent);
        border: 1px solid color-mix(in oklab, var(--dw-accent) 35%, var(--dw-border));
        border-radius: 4px;
        opacity: 0;
        transform: translateY(-6px) scale(0.92);
        animation: section-drop 4.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 6px;
      }
      .canvas-bar {
        height: 3px;
        width: 50%;
        background: color-mix(in oklab, var(--dw-text-muted) 50%, transparent);
        border-radius: 2px;
      }
      :global(.build-cursor) {
        position: absolute;
        animation: build-cursor-path 4.8s ease-in-out infinite;
      }
      @keyframes tray-pickup {
        0%,
        4%,
        100% {
          background: transparent;
          transform: translateY(0);
        }
        8% {
          background: color-mix(in oklab, var(--dw-accent) 14%, transparent);
        }
        14% {
          transform: translateY(0);
        }
        18% {
          transform: translateY(-2px);
        }
      }
      @keyframes section-drop {
        0%,
        14% {
          opacity: 0;
          transform: translateY(-6px) scale(0.92);
        }
        18% {
          opacity: 1;
          transform: translateY(0) scale(1);
          box-shadow: 0 0 0 2px
            color-mix(in oklab, var(--dw-accent) 35%, transparent);
        }
        26% {
          box-shadow: 0 0 0 0 transparent;
        }
        90%,
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes build-cursor-path {
        0% {
          left: 18%;
          top: 14%;
        }
        12% {
          left: 18%;
          top: 14%;
        }
        20% {
          left: 60%;
          top: 22%;
        }
        25%,
        32% {
          left: 60%;
          top: 22%;
        }
        45% {
          left: 18%;
          top: 50%;
        }
        50% {
          left: 60%;
          top: 50%;
        }
        65% {
          left: 18%;
          top: 86%;
        }
        72% {
          left: 60%;
          top: 78%;
        }
        100% {
          left: 60%;
          top: 78%;
        }
      }
    `}</style>
  </div>
);

const EDIT_LINES = [
  "Healthier mornings, no compromise.",
  "The protein bar that just works.",
  "Built for runners, by runners.",
];

const EditStep = () => (
  <div className="viz-card">
    <div className="viz-noise" />
    <div className="edit-pane">
      <div className="edit-section">
        <div className="edit-headline">
          {EDIT_LINES.map((line, i) => (
            <span
              key={i}
              className="edit-line"
              style={{ animationDelay: `${i * 4}s` }}
            >
              {line}
            </span>
          ))}
          <span className="edit-caret" />
        </div>
        <div className="edit-meta">
          <span className="edit-swatch swatch-1" />
          <span className="edit-swatch swatch-2" />
          <span className="edit-swatch swatch-3" />
        </div>
      </div>
      <Cursor className="edit-cursor" />
    </div>
    <style jsx>{`
      .viz-card {
        position: relative;
        height: 116px;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(
          180deg,
          color-mix(in oklab, var(--dw-surface2) 100%, transparent),
          color-mix(in oklab, var(--dw-surface) 96%, transparent)
        );
        border: 1px solid var(--dw-border);
        overflow: hidden;
        padding: 14px;
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--dw-text) 6%, transparent),
          0 18px 40px -28px rgba(0, 0, 0, 0.6);
      }
      .viz-noise {
        position: absolute;
        inset: 0;
        opacity: 0.4;
        pointer-events: none;
        background-image: radial-gradient(
          color-mix(in oklab, var(--dw-text) 4%, transparent) 1px,
          transparent 1px
        );
        background-size: 6px 6px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
      }
      .edit-pane {
        position: relative;
        height: 100%;
      }
      .edit-section {
        position: relative;
        height: 100%;
        background: var(--dw-bg);
        border: 1px solid color-mix(in oklab, var(--dw-accent) 50%, var(--dw-border));
        border-radius: 8px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 0 0 2px
          color-mix(in oklab, var(--dw-accent) 12%, transparent);
      }
      .edit-headline {
        position: relative;
        height: 14px;
        display: flex;
        align-items: center;
      }
      .edit-line {
        position: absolute;
        inset: 0;
        font-size: 11.5px;
        font-weight: 500;
        color: var(--dw-text);
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        opacity: 0;
        clip-path: inset(0 100% 0 0);
        animation: edit-type 12s ease-in-out infinite;
      }
      .edit-caret {
        position: absolute;
        left: 0;
        top: 1px;
        width: 1.5px;
        height: 12px;
        background: var(--dw-accent);
        animation: caret-step 12s linear infinite;
      }
      .edit-meta {
        display: flex;
        gap: 5px;
      }
      .edit-swatch {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 1px solid color-mix(in oklab, var(--dw-text) 12%, transparent);
      }
      .swatch-1 {
        background: var(--dw-accent);
      }
      .swatch-2 {
        background: color-mix(in oklab, var(--dw-accent) 30%, var(--dw-bg));
      }
      .swatch-3 {
        background: var(--dw-text);
      }
      :global(.edit-cursor) {
        position: absolute;
        animation: edit-cursor-path 12s ease-in-out infinite;
      }
      @keyframes edit-type {
        0% {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
        }
        4% {
          opacity: 1;
        }
        20% {
          clip-path: inset(0 0 0 0);
        }
        28% {
          clip-path: inset(0 0 0 0);
        }
        33% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes caret-step {
        0%,
        24% {
          left: 0;
        }
        25%,
        32% {
          left: 92%;
          opacity: 0;
        }
        33%,
        57% {
          left: 0;
        }
        58%,
        65% {
          left: 92%;
          opacity: 0;
        }
        66%,
        90% {
          left: 0;
        }
        91%,
        100% {
          left: 92%;
          opacity: 0;
        }
      }
      @keyframes edit-cursor-path {
        0% {
          left: 8%;
          top: 24%;
        }
        24% {
          left: 70%;
          top: 24%;
        }
        30% {
          left: 28%;
          top: 70%;
        }
        50% {
          left: 32%;
          top: 70%;
        }
        70% {
          left: 50%;
          top: 70%;
        }
        100% {
          left: 50%;
          top: 70%;
        }
      }
    `}</style>
  </div>
);

const PublishStep = () => (
  <div className="viz-card">
    <div className="viz-noise" />
    <div className="pub-row">
      <div className="pub-source">
        <span className="pub-bar pub-bar-1" />
        <span className="pub-bar pub-bar-2" />
        <span className="pub-bar pub-bar-3" />
      </div>
      <div className="pub-track">
        <span className="pub-line" />
        <span className="pub-comet" />
      </div>
      <div className="pub-target">
        <img src="/shopify-logo.png" alt="Shopify" className="pub-logo" />
      </div>
    </div>
    <style jsx>{`
      .viz-card {
        position: relative;
        height: 116px;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(
          180deg,
          color-mix(in oklab, var(--dw-surface2) 100%, transparent),
          color-mix(in oklab, var(--dw-surface) 96%, transparent)
        );
        border: 1px solid var(--dw-border);
        overflow: hidden;
        padding: 18px 18px;
        box-shadow:
          inset 0 1px 0 color-mix(in oklab, var(--dw-text) 6%, transparent),
          0 18px 40px -28px rgba(0, 0, 0, 0.6);
      }
      .viz-noise {
        position: absolute;
        inset: 0;
        opacity: 0.4;
        pointer-events: none;
        background-image: radial-gradient(
          color-mix(in oklab, var(--dw-text) 4%, transparent) 1px,
          transparent 1px
        );
        background-size: 6px 6px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
      }
      .pub-row {
        position: relative;
        height: 100%;
        display: grid;
        grid-template-columns: 44px 1fr 44px;
        align-items: center;
        gap: 10px;
      }
      .pub-source {
        height: 44px;
        background: var(--dw-bg);
        border: 1px solid var(--dw-border);
        border-radius: 6px;
        padding: 7px 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
      }
      .pub-bar {
        height: 3px;
        background: color-mix(in oklab, var(--dw-text-muted) 45%, transparent);
        border-radius: 2px;
      }
      .pub-bar-1 {
        width: 100%;
        background: color-mix(in oklab, var(--dw-accent) 70%, transparent);
      }
      .pub-bar-2 {
        width: 75%;
      }
      .pub-bar-3 {
        width: 55%;
      }
      .pub-track {
        position: relative;
        height: 1px;
        width: 100%;
      }
      .pub-line {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          color-mix(in oklab, var(--dw-accent) 45%, transparent) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: pub-glow 2.6s linear infinite;
      }
      .pub-comet {
        position: absolute;
        top: 50%;
        left: 0;
        width: 5px;
        height: 5px;
        margin-top: -2.5px;
        border-radius: 999px;
        background: var(--dw-accent);
        box-shadow:
          0 0 0 1px color-mix(in oklab, var(--dw-accent) 40%, transparent),
          0 0 12px 2px var(--dw-accent),
          -10px 0 16px -2px color-mix(in oklab, var(--dw-accent) 70%, transparent);
        animation: pub-comet 2.6s cubic-bezier(0.55, 0, 0.45, 1) infinite;
      }
      .pub-target {
        position: relative;
        height: 44px;
        width: 44px;
        background: #fff;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px;
        box-shadow:
          0 0 0 1px color-mix(in oklab, var(--dw-accent) 30%, transparent),
          0 0 0 4px color-mix(in oklab, var(--dw-accent) 12%, transparent),
          0 8px 18px -8px color-mix(in oklab, var(--dw-accent) 50%, transparent);
        animation: pub-target-glow 2.6s ease-in-out infinite;
      }
      .pub-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      @keyframes pub-glow {
        0% {
          background-position: -100% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      @keyframes pub-comet {
        0% {
          left: 0%;
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        85% {
          opacity: 1;
        }
        100% {
          left: 100%;
          opacity: 0;
        }
      }
      @keyframes pub-target-glow {
        0%,
        70% {
          box-shadow:
            0 0 0 1px color-mix(in oklab, var(--dw-accent) 30%, transparent),
            0 0 0 4px color-mix(in oklab, var(--dw-accent) 12%, transparent),
            0 8px 18px -8px color-mix(in oklab, var(--dw-accent) 50%, transparent);
        }
        85% {
          box-shadow:
            0 0 0 1px color-mix(in oklab, var(--dw-accent) 70%, transparent),
            0 0 0 8px color-mix(in oklab, var(--dw-accent) 22%, transparent),
            0 10px 28px -6px color-mix(in oklab, var(--dw-accent) 80%, transparent);
        }
      }
    `}</style>
  </div>
);

const Cursor = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="16"
    viewBox="0 0 14 16"
    fill="none"
    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
  >
    <path
      d="M2 2 L11 11.2 L7.4 11.6 L9.4 14.6 L7.6 15.4 L5.6 12.4 L3.2 14 Z"
      fill="var(--dw-bg)"
      stroke="var(--dw-text)"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </svg>
);
