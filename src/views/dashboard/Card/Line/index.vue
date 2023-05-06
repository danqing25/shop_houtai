<template>
  <div class="lineChart" ref="lineChart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "lineChart",
  mounted() {
    let myChart = echarts.init(this.$refs.lineChart);
    myChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: { show: false },
      series: [
        {
          type: "line",
          data: [5, 20, 10, 33, 20, 15, 20, 10],
          smooth: true,
          // 拐点样式
          itemStyle: { opacity: 0 },
          // 线条样式
          lineStyle: { color: "purple" },
          // 渐变填充
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      // 布局
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });
  },
};
</script>

<style>
.lineChart {
  width: 100%;
  height: 100%;
}
</style>