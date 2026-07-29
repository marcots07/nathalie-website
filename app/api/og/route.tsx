import { ImageResponse } from "@vercel/og";
import { getDictionary, isLocale } from "@/lib/i18n";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const localeParam = searchParams.get("locale") || "es";
  const locale = isLocale(localeParam) ? localeParam : "es";
  const dict = getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fbf9f4",
          padding: "80px",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Organic pastel shapes */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(163, 193, 153, 0.55)",
            filter: "blur(20px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(230, 176, 154, 0.45)",
            filter: "blur(20px)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#496a41",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ width: 40, height: 1, background: "#5f8555" }} />
            Jersey City, NJ
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 90,
                lineHeight: 1,
                color: "#2a2a26",
                fontStyle: "italic",
                letterSpacing: "-0.02em",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Nathalie</span>
              <span>Gonzalez Perez</span>
            </div>
            <div
              style={{
                marginTop: 40,
                fontSize: 32,
                color: "#4a4a44",
                maxWidth: 900,
                fontFamily: "sans-serif",
                fontStyle: "normal",
                lineHeight: 1.35,
              }}
            >
              {dict.meta.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 22,
              color: "#7a7a72",
              fontFamily: "sans-serif",
            }}
          >
            <span>nathaliegonzalez.com</span>
            <span>{locale === "es" ? "Portafolio" : "Portfolio"}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
