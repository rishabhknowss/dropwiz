export const HalfIosMobile = ({
  storeName = "Dropwiz",
  productTitle = "Premium Whey Protein",
  productSub = "Cookies & Cream — 2.5lb",
  price = "$49.00",
  imageUrl,
}: {
  storeName?: string;
  productTitle?: string;
  productSub?: string;
  price?: string;
  imageUrl?: string;
}) => (
  <div className="ios-host">
    <div className="ios-frame">
      <div className="ios-screen">
        <div className="ios-statusbar">
          <span className="ios-time">9:41</span>
          <span className="ios-notch" />
          <span className="ios-icons">
            <span className="ios-bars">
              <span /><span /><span /><span />
            </span>
            <span className="ios-wifi" />
            <span className="ios-battery" />
          </span>
        </div>

        <div className="ios-nav">
          <span className="ios-back" />
          <span className="ios-store">{storeName}</span>
          <span className="ios-cart" />
        </div>

        <div className="ios-content">
          <div className="ios-image">
            {imageUrl ? (
              <img src={imageUrl} alt="" />
            ) : (
              <div className="ios-image-fallback" />
            )}
            <span className="ios-live">
              <span className="ios-live-dot" />
              LIVE
            </span>
          </div>

          <div className="ios-meta">
            <div className="ios-title">{productTitle}</div>
            <div className="ios-sub">{productSub}</div>
            <div className="ios-row">
              <div className="ios-price">{price}</div>
              <div className="ios-stars">★★★★★</div>
            </div>
          </div>

          <button className="ios-buy">Add to bag</button>
        </div>
      </div>
    </div>

    <style jsx>{`
      .ios-host {
        position: absolute;
        left: 50%;
        top: 28px;
        transform: translateX(-50%);
        pointer-events: none;
      }
      .ios-frame {
        position: relative;
        width: 240px;
        height: 480px;
        background: linear-gradient(180deg, #1a1a1a, #0a0a0a);
        border-radius: 38px;
        padding: 8px;
        box-shadow:
          inset 0 0 0 1.5px rgba(255, 255, 255, 0.06),
          inset 0 0 0 4px #050505,
          0 30px 60px -25px rgba(0, 0, 0, 0.85),
          0 0 0 1px rgba(199, 255, 61, 0.08);
      }
      .ios-screen {
        position: relative;
        width: 100%;
        height: 100%;
        background: #ffffff;
        border-radius: 32px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .ios-statusbar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 18px 6px;
        font-size: 11px;
        font-weight: 600;
        color: #0a0a0a;
      }
      .ios-time {
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
      }
      .ios-notch {
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 78px;
        height: 22px;
        background: #050505;
        border-radius: 999px;
      }
      .ios-icons {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .ios-bars {
        display: inline-flex;
        align-items: flex-end;
        gap: 1px;
        height: 8px;
      }
      .ios-bars span {
        width: 2px;
        background: #0a0a0a;
        border-radius: 0.5px;
      }
      .ios-bars span:nth-child(1) { height: 30%; }
      .ios-bars span:nth-child(2) { height: 55%; }
      .ios-bars span:nth-child(3) { height: 80%; }
      .ios-bars span:nth-child(4) { height: 100%; }
      .ios-wifi {
        width: 9px;
        height: 7px;
        background: radial-gradient(circle at 50% 100%, #0a0a0a 30%, transparent 35%),
          radial-gradient(circle at 50% 100%, transparent 30%, #0a0a0a 35%, #0a0a0a 50%, transparent 55%);
      }
      .ios-battery {
        width: 16px;
        height: 7px;
        border: 1px solid #0a0a0a;
        border-radius: 1.5px;
        position: relative;
        background: linear-gradient(to right, #0a0a0a 80%, transparent 80%);
      }
      .ios-battery::after {
        content: "";
        position: absolute;
        right: -2px;
        top: 1.5px;
        width: 1.5px;
        height: 3px;
        background: #0a0a0a;
        border-radius: 0 1px 1px 0;
      }
      .ios-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 14px 10px;
        border-bottom: 1px solid rgba(10, 10, 10, 0.06);
      }
      .ios-back,
      .ios-cart {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: rgba(10, 10, 10, 0.08);
      }
      .ios-store {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: #0a0a0a;
      }
      .ios-content {
        flex: 1;
        padding: 14px 14px 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ios-image {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 14px;
        overflow: hidden;
        background: linear-gradient(135deg, #fef9c3 0%, #c7ff3d 60%, #84cc16 100%);
      }
      .ios-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .ios-image-fallback {
        position: absolute;
        inset: 24%;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 12px;
        backdrop-filter: blur(8px);
      }
      .ios-live {
        position: absolute;
        top: 8px;
        left: 8px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 7px;
        border-radius: 999px;
        background: rgba(10, 10, 10, 0.8);
        backdrop-filter: blur(8px);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #c7ff3d;
      }
      .ios-live-dot {
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: #c7ff3d;
        box-shadow: 0 0 6px #c7ff3d;
        animation: ios-pulse 1.6s ease-in-out infinite;
      }
      @keyframes ios-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .ios-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ios-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.015em;
        color: #0a0a0a;
      }
      .ios-sub {
        font-size: 11px;
        color: rgba(10, 10, 10, 0.55);
      }
      .ios-row {
        margin-top: 4px;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
      .ios-price {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #0a0a0a;
      }
      .ios-stars {
        color: #f59e0b;
        font-size: 11px;
        letter-spacing: 0.05em;
      }
      .ios-buy {
        margin-top: auto;
        background: #0a0a0a;
        color: #ffffff;
        font-size: 13px;
        font-weight: 600;
        padding: 12px;
        border-radius: 12px;
        border: 0;
      }
    `}</style>
  </div>
);
