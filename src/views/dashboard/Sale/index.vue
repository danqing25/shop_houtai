<template>
  <el-card>
    <div class="header">
      <el-tabs v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visits"></el-tab-pane>
      </el-tabs>
      <!-- 右侧内容 -->
      <div class="right">
        <span @click="getDay">今日</span>
        <span @click="getWeek">本周</span>
        <span @click="getMonth">本月</span>
        <span @click="getYear">本年</span>
        <el-date-picker
          v-model="dateArr"
          class="date"
          type="daterange"
          size="mini"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 中间图表 -->
    <el-row :gutter="10">
      <!-- 柱状图 -->
      <el-col :span="19">
        <div ref="barContext" style="width: 100%; height: 300px"></div>
      </el-col>
      <el-col :span="5">
        <div class="mid-right">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li v-for="(order, index) in dataObj.orderRank" :key="index">
              <span>{{ order.no }}</span>
              <span>{{ order.name }}</span>
              <span class="sale-value">{{ order.money }}</span>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myChart: {}, // 柱状图对象
      dateArr: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState("home", ["dataObj"]),
  },
  watch: {
    title() {
      // 一旦发生变化就重新配置柱状图的标题
      this.myChart.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: [
          {
            data:
              this.activeName == "sale"
                ? this.dataObj.userFullYearAxis
                : this.dataObj.orderFullYearAxis,
          },
        ],
        series: [
          {
            data:
              this.activeName == "sale"
                ? this.dataObj.userFullYear
                : this.dataObj.orderFullYear,
          },
        ],
      });
    },
    dataObj() {
      // mock数据加载完就展示
      this.myChart.setOption({
        xAxis: [
          {
            data:
              this.activeName == "sale"
                ? this.dataObj.userFullYearAxis
                : this.dataObj.orderFullYearAxis,
          },
        ],
        series: [
          {
            data:
              this.activeName == "sale"
                ? this.dataObj.userFullYear
                : this.dataObj.orderFullYear,
          },
        ],
      });
    },
  },
  methods: {
    getDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.dateArr = [day, day];
    },
    getWeek() {
      const startDay = dayjs().day(0).format("YYYY-MM-DD");
      const endDay = dayjs().day(6).format("YYYY-MM-DD");
      this.dateArr = [startDay, endDay];
    },
    getMonth() {
      const startDay = dayjs().startOf("month").format("YYYY-MM-DD");
      const endDay = dayjs().endOf("month").format("YYYY-MM-DD");
      this.dateArr = [startDay, endDay];
    },
    getYear() {
      const startDay = dayjs().startOf("year").format("YYYY-MM-DD");
      const endDay = dayjs().endOf("year").format("YYYY-MM-DD");
      this.dateArr = [startDay, endDay];
    },
  },
  mounted() {
    this.$store.dispatch("home/getData");

    this.myChart = echarts.init(this.$refs.barContext);
    this.myChart.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 54, 321, 344, 233, 187],
          color: "blue",
        },
      ],
    });

    // 为门店销售额前3的小li的span添加top-index类,其余加index类
    this.$nextTick(() => {
      const lis = document.querySelectorAll(".mid-right li");
      for (let i = 0; i < lis.length; i++) {
        if (i < 3) {
          const spans = lis[i].querySelectorAll("span");
          spans[0].classList.add("top-index");
        } else {
          const spans = lis[i].querySelectorAll("span");
          spans[0].classList.add("index");
        }
      }
    });
  },
};
</script>

<style scoped>
::v-deep .header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .right span {
  margin-left: 10px;
  font-size: 0.2rem;
}
::v-deep .date {
  width: 250px !important;
  margin: 0 20px;
}
::v-deep .mid-right h3 {
  padding: 0;
  margin: 0;
}
::v-deep ul {
  list-style: none;
  height: 300px;
  padding: 0;
  margin: 0;
}
::v-deep ul li {
  height: 8%;
  margin: 10px 0;
}
::v-deep .top-index {
  float: left;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}
::v-deep .index {
  float: left;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  text-align: center;
}
::v-deep .sale-value {
  float: right;
}
</style>