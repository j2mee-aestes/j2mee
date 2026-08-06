import type { TideChartPoint } from "@/types/fishing";
import { UI_TEXT } from "@/constants/uiText";

interface TideChartProps {
  points: TideChartPoint[];
  currentTimeLabel: string;
  className?: string;
}

export function TideChart({
  points,
  currentTimeLabel,
  className = "",
}: TideChartProps) {
  if (points.length === 0) {
    return null;
  }

  const width = 320;
  const height = 140;
  const paddingX = 16;
  const paddingY = 18;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const coords = points.map((point, index) => {
    const x =
      paddingX +
      (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth);
    const y = paddingY + chartHeight - (point.height / 100) * chartHeight;
    return { ...point, x, y };
  });

  const linePath = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${
    height - paddingY
  } L ${coords[0].x} ${height - paddingY} Z`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-36 w-full"
        role="img"
        aria-label={`조위 그래프, 현재 시각 ${currentTimeLabel}`}
      >
        <defs>
          <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((ratio) => {
          const y = paddingY + chartHeight * (1 - ratio);
          return (
            <line
              key={ratio}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="url(#tideFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((point) => {
          if (point.kind === "high" || point.kind === "low") {
            return (
              <g key={`${point.time}-${point.kind}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={point.kind === "high" ? "#0284c7" : "#0f766e"}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  x={point.x}
                  y={point.y - 8}
                  textAnchor="middle"
                  className="fill-slate-600 text-[9px]"
                >
                  {point.kind === "high" ? UI_TEXT.highTide : UI_TEXT.lowTide}
                </text>
              </g>
            );
          }
          if (point.kind === "now") {
            return (
              <g key={`now-${point.time}`}>
                <line
                  x1={point.x}
                  x2={point.x}
                  y1={paddingY}
                  y2={height - paddingY}
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={height - 4}
                  textAnchor="middle"
                  className="fill-orange-600 text-[9px] font-semibold"
                >
                  {currentTimeLabel}
                </text>
              </g>
            );
          }
          return null;
        })}

        <text
          x={paddingX}
          y={height - 2}
          className="fill-slate-400 text-[9px]"
        >
          {points[0].time}
        </text>
        <text
          x={width - paddingX}
          y={height - 2}
          textAnchor="end"
          className="fill-slate-400 text-[9px]"
        >
          {points[points.length - 1].time}
        </text>
      </svg>
    </div>
  );
}
