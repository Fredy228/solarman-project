import { getLocale } from "next-intl/server";
import Link from "next/link";
import {
  buildLocalizedPath,
  normalizeLocale,
} from "@/src/shared/utils/localized-path";

const messages = {
  uk: {
    title: "Сторінку не знайдено",
    description:
      "Здається, ця сторінка загубилася десь під сонячними панелями. Повернемося на головну?",
    button: "На головну",
  },
  ru: {
    title: "Страница не найдена",
    description:
      "Кажется, эта страница потерялась под солнечными панелями. Вернёмся на главную?",
    button: "На главную",
  },
};

function SunDecoration() {
  const numRays = 16;
  const rays = Array.from({ length: numRays }, (_, i) => {
    const angle = (i * (360 / numRays) * Math.PI) / 180;
    const isLong = i % 2 === 0;
    const innerRadius = 100;
    const outerRadius = isLong ? 175 : 145;
    const x1 = 200 + Math.cos(angle) * innerRadius;
    const y1 = 200 + Math.sin(angle) * innerRadius;
    const x2 = 200 + Math.cos(angle) * outerRadius;
    const y2 = 200 + Math.sin(angle) * outerRadius;
    return { x1, y1, x2, y2, isLong };
  });

  return (
    <svg
      width="420"
      height="420"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        userSelect: "none",
        width: "100%",
        maxWidth: "420px",
        height: "auto",
      }}
    >
      <circle cx="200" cy="200" r="92" fill="#fc7300" opacity="0.18" />
      <circle cx="200" cy="200" r="72" fill="#fc7300" opacity="0.12" />
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="#fc7300"
          strokeWidth={ray.isLong ? 13 : 7}
          strokeLinecap="round"
          opacity={ray.isLong ? 0.22 : 0.14}
        />
      ))}
    </svg>
  );
}

export default async function NotFound() {
  let locale: string = "uk";
  try {
    locale = await getLocale();
  } catch {
    // outside intl context — use default
  }
  const resolvedLocale = normalizeLocale(locale);
  const t = messages[resolvedLocale as keyof typeof messages] ?? messages.uk;

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(186.93% 102.34% at 81.46% 7.95%, #fff8de 0%, #dceeff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 16px",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
        {/* 404 + sun */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 260,
          }}
        >
          <SunDecoration />
          <span
            style={{
              fontSize: "clamp(120px, 20vw, 210px)",
              fontWeight: 800,
              color: "#fc7300",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              position: "relative",
              zIndex: 1,
              textShadow: "0 2px 60px rgba(252, 115, 0, 0.22)",
              userSelect: "none",
            }}
          >
            404
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 34px)",
            fontWeight: 700,
            color: "#02244d",
            margin: "8px 0 16px",
          }}
        >
          {t.title}
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#505f7c",
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: 1.75,
            maxWidth: 500,
            margin: "0 auto 32px",
          }}
        >
          {t.description}
        </p>

        {/* Button */}
        <Link
          href={buildLocalizedPath(resolvedLocale, "/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#fc7300",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(252, 115, 0, 0.30)",
            transition: "background 0.2s",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {t.button}
        </Link>
      </div>
    </section>
  );
}
