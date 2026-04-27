export const CtaAtmosphere = () => (
  <>
    <div className="dw-cta-atmos absolute inset-0 -z-0">
      <span className="cloud cloud-a" />
      <span className="cloud cloud-b" />
      <span className="cloud cloud-c" />
      <span className="cloud cloud-d" />
      <span className="grid-overlay" />
    </div>
    <style jsx>{`
      .dw-cta-atmos {
        overflow: hidden;
        pointer-events: none;
      }
      .cloud {
        position: absolute;
        inset: -25%;
        mix-blend-mode: screen;
        will-change: transform;
      }
      .cloud-a {
        background: radial-gradient(
          38% 30% at 18% 28%,
          color-mix(in oklab, var(--dw-accent) 22%, transparent) 0%,
          transparent 70%
        );
        filter: blur(48px);
        animation: cta-cloud-a 14s ease-in-out infinite;
      }
      .cloud-b {
        background: radial-gradient(
          32% 26% at 82% 72%,
          color-mix(in oklab, var(--dw-accent) 16%, transparent) 0%,
          transparent 75%
        );
        filter: blur(60px);
        animation: cta-cloud-b 18s ease-in-out infinite reverse;
      }
      .cloud-c {
        background: radial-gradient(
          22% 18% at 50% 50%,
          color-mix(in oklab, var(--dw-accent) 18%, transparent) 0%,
          transparent 75%
        );
        filter: blur(40px);
        animation: cta-cloud-c 11s ease-in-out infinite;
      }
      .cloud-d {
        background: radial-gradient(
          24% 20% at 70% 18%,
          color-mix(in oklab, var(--dw-accent) 12%, transparent) 0%,
          transparent 80%
        );
        filter: blur(56px);
        animation: cta-cloud-d 22s ease-in-out infinite reverse;
      }
      .grid-overlay {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(
            to right,
            color-mix(in oklab, var(--dw-text) 4%, transparent) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            color-mix(in oklab, var(--dw-text) 4%, transparent) 1px,
            transparent 1px
          );
        background-size: 64px 64px;
        mask-image: radial-gradient(
          ellipse 70% 60% at 50% 50%,
          black 0%,
          transparent 80%
        );
        opacity: 0.6;
      }
      @keyframes cta-cloud-a {
        0%,
        100% {
          transform: translate3d(-3%, -2%, 0) scale(1) rotate(0deg);
        }
        50% {
          transform: translate3d(8%, 4%, 0) scale(1.15) rotate(8deg);
        }
      }
      @keyframes cta-cloud-b {
        0%,
        100% {
          transform: translate3d(4%, 3%, 0) scale(1.1) rotate(0deg);
        }
        50% {
          transform: translate3d(-9%, -5%, 0) scale(1.25) rotate(-12deg);
        }
      }
      @keyframes cta-cloud-c {
        0%,
        100% {
          transform: translate3d(0, 0, 0) scale(1);
        }
        50% {
          transform: translate3d(4%, -3%, 0) scale(1.3);
        }
      }
      @keyframes cta-cloud-d {
        0%,
        100% {
          transform: translate3d(2%, -1%, 0) scale(1.05);
        }
        50% {
          transform: translate3d(-6%, 4%, 0) scale(0.92);
        }
      }
    `}</style>
  </>
);
