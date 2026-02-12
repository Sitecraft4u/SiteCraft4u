import Image from "next/image";

export default function Loading() {
  return (
    <div className="site-loader" role="status" aria-live="polite">
      <div className="loader-glow" />
      <div className="loader-logo-wrap">
        <Image
          src="/sitecraft4u-logo.svg"
          alt="Sitecraft4u"
          width={280}
          height={84}
          className="loader-logo"
          priority
        />
      </div>
      <p className="loader-text">Loading your experience...</p>
    </div>
  );
}
