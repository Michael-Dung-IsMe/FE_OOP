import { useTheme, Box, Typography } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../../../assets/theme";

interface FinancialOverviewChartProps {
  data: {
    id: string;
    data: { x: string; y: number }[];
  }[];
}

const FinancialOverviewChart = ({ data }: FinancialOverviewChartProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0) {
      return <Box height="100%" display="flex" alignItems="center" justifyContent="center">No Data</Box>;
  }

  return (
    <Box height="400px" width="100%">
      <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: colors.grey[100] }}>
        Biểu đồ Tài chính (12 tháng)
      </Typography>
      <ResponsiveLine
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
                color: colors.primary[500],
            }
          }
        }}
        colors={[`${colors.redAccent[600]}`, `${colors.greenAccent[600]}`]}
        margin={{ top: 50, right: 110, bottom: 50, left: 70 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        // Format trục Y: Giữ nguyên số (vì đã là k)
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Số tiền (k VNĐ)",
          legendOffset: -60,
          legendPosition: "middle",
          format: (value) => `${value}k`, 
        }}
        // Format tooltip
        yFormat={(value) => 
            `${new Intl.NumberFormat("vi-VN").format(Number(value))} k VNĐ`
        }
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tháng",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default FinancialOverviewChart;