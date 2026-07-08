"use client"

import { Label, Pie, PieChart } from "recharts"

import type { TargetChartProps } from '@/components/custom/Target/types';
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
    
} from "@/components/ui/chart"
import type {ChartConfig} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/format-compact-number"

export default function TargetChart({ target, remaining, business }: TargetChartProps) {

    const chartConfig = {
        progress: {
            label: "Progress",
            color: business.primary_color,
        },
        remaining: {
            label: "Remaining",
            color: business.secondary_color,
        },
    } satisfies ChartConfig

    const chartData = [
        { name: "progress", value: target - remaining, fill: business.secondary_color },
        { name: "remaining", value: remaining, fill: business.primary_color },
    ]

    return (
        <Card className="flex p-0 m-0 flex-col border-0 shadow-none animate-in fade-in duration-700">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[180px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {formatCompactNumber(target)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Target
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
