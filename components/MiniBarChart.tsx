import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C, PIXEL_FONT, F } from "@/theme/pixel";

interface MiniBarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export default function MiniBarChart({
  data,
  height = 120,
}: MiniBarChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>NO DATA YET</Text>
      </View>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, idx) => {
          const barHeight = (Math.abs(item.value) / maxVal) * (height - 24);
          const isNegative = item.value < 0;

          return (
            <View key={idx} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 2),
                      backgroundColor: isNegative ? C.red : C.green,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  bar: {
    width: "70%",
    borderRadius: 0,
    minWidth: 6,
  },
  barLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
    marginTop: 3,
  },
  emptyText: {
    fontFamily: PIXEL_FONT,
    color: C.textMuted,
    fontSize: F.body,
    textAlign: "center",
  },
});
