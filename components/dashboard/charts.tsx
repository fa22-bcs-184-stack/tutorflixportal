"use client"

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart,
  XAxis, YAxis,
} from "recharts"
import {
  ChartContainer, ChartLegend, ChartLegendContent,
  ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"

const AXIS = {
  tick: {
    fontSize: 11,
    fontFamily: "var(--font-sans)",
    fill: "oklch(0.45 0.016 258)",
    fontWeight: 500,
  },
  axisLine:   false as const,
  tickLine:   false as const,
  tickMargin: 10,
}

const GRID = {
  vertical:        false,
  strokeDasharray: "1 5",
  stroke:          "oklch(1 0 0 / 0.07)",
}

/* ─── Area trend — premium gradient fills ─── */
export function AreaTrendChart({
  data, keys, config, height = 240,
}: {
  data: Record<string, number | string>[]
  keys: string[]
  config: ChartConfig
  height?: number
}) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: -4, right: 12, top: 16, bottom: 0 }}>
        <defs>
          {keys.map((k, i) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={`var(--color-${k})`} stopOpacity={i === 0 ? 0.32 : 0.20} />
              <stop offset="85%"  stopColor={`var(--color-${k})`} stopOpacity={0.03} />
              <stop offset="100%" stopColor={`var(--color-${k})`} stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...GRID} />
        <XAxis dataKey="label" {...AXIS} />
        <YAxis {...AXIS} width={30} domain={["auto", "auto"]} />
        <ChartTooltip
          content={<ChartTooltipContent indicator="dot" />}
          cursor={{
            stroke: "var(--primary)",
            strokeWidth: 1,
            strokeDasharray: "3 3",
            strokeOpacity: 0.4,
          }}
        />
        {keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {keys.map((k) => (
          <Area
            key={k}
            dataKey={k}
            type="monotoneX"
            stroke={`var(--color-${k})`}
            fill={`url(#grad-${k})`}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              stroke: "var(--card)",
              fill: `var(--color-${k})`,
            }}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

/* ─── Line trend ─── */
export function LineTrendChart({
  data, keys, config, height = 240,
}: {
  data: Record<string, number | string>[]
  keys: string[]
  config: ChartConfig
  height?: number
}) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <LineChart data={data} margin={{ left: -4, right: 12, top: 16, bottom: 0 }}>
        <CartesianGrid {...GRID} />
        <XAxis dataKey="label" {...AXIS} />
        <YAxis {...AXIS} width={30} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />}
          cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "3 3", strokeOpacity: 0.4 }}
        />
        {keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {keys.map((k) => (
          <Line
            key={k}
            dataKey={k}
            type="monotoneX"
            stroke={`var(--color-${k})`}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)", fill: `var(--color-${k})` }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

/* ─── Bar chart — rounded, colored cells ─── */
export function BarValueChart({
  data, dataKey, config, height = 220,
}: {
  data: Record<string, number | string>[]
  dataKey: string
  config: ChartConfig
  height?: number
}) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: -4, right: 8, top: 16, bottom: 0 }} barCategoryGap="42%">
        <CartesianGrid {...GRID} />
        <XAxis dataKey="label" {...AXIS} />
        <YAxis {...AXIS} width={30} />
        <ChartTooltip
          content={<ChartTooltipContent indicator="dot" />}
          cursor={{ fill: "oklch(1 0 0 / 0.04)", radius: 8 }}
        />
        <Bar dataKey={dataKey} radius={[6, 6, 2, 2]} maxBarSize={44}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={`var(--color-${(entry.color as string) ?? dataKey})`}
              fillOpacity={0.88}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/* ─── Donut — premium center label ─── */
export function DonutChart({
  data, config, centerLabel, centerValue,
}: {
  data: { label: string; value: number; color: string }[]
  config: ChartConfig
  centerLabel?: string
  centerValue?: string
}) {
  return (
    <ChartContainer config={config} className="mx-auto aspect-square w-full max-w-[220px]">
      <PieChart>
        <defs>
          {data.map((d) => (
            <radialGradient key={d.color} id={`donut-${d.color}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={`var(--color-${d.color})`} stopOpacity={1}   />
              <stop offset="100%" stopColor={`var(--color-${d.color})`} stopOpacity={0.75} />
            </radialGradient>
          ))}
        </defs>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={2.5}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={`url(#donut-${entry.color})`} />
          ))}
        </Pie>
        {centerValue && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-0.3em" style={{
              fontSize: "1.55rem",
              fontWeight: 700,
              fill: "oklch(0.93 0.008 252)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "-0.03em",
            }}>
              {centerValue}
            </tspan>
            <tspan x="50%" dy="1.55em" style={{
              fontSize: "0.67rem",
              fill: "oklch(0.55 0.016 258)",
              fontFamily: "var(--font-sans)",
            }}>
              {centerLabel}
            </tspan>
          </text>
        )}
      </PieChart>
    </ChartContainer>
  )
}

/* ─── Radial progress — sleek arc ─── */
export function RadialProgressChart({
  value, label, color = "chart-1",
}: { value: number; label: string; color?: string }) {
  const config = { value: { label, color: `var(--${color})` } } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="mx-auto aspect-square w-full max-w-[180px]">
      <RadialBarChart
        data={[{ name: label, value, fill: "var(--color-value)" }]}
        startAngle={90}
        endAngle={90 - (value / 100) * 360}
        innerRadius={56}
        outerRadius={82}
      >
        <defs>
          <linearGradient id="radial-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor={`var(--color-${color})`} />
            <stop offset="100%" stopColor={`color-mix(in oklch, var(--color-${color}) 70%, var(--accent))`} />
          </linearGradient>
        </defs>
        <RadialBar
          dataKey="value"
          background={{ fill: "oklch(1 0 0 / 0.06)" }}
          cornerRadius={8}
          fill="url(#radial-grad)"
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-0.15em" style={{
            fontSize: "1.55rem",
            fontWeight: 700,
            fill: "var(--foreground)",
            fontFamily: "var(--font-sans)",
            letterSpacing: "-0.03em",
          }}>
            {value}%
          </tspan>
          <tspan x="50%" dy="1.6em" style={{
            fontSize: "0.62rem",
            fill: "var(--muted-foreground)",
            fontFamily: "var(--font-sans)",
          }}>
            {label}
          </tspan>
        </text>
      </RadialBarChart>
    </ChartContainer>
  )
}
