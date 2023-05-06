<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="middle">
          <div class="desc">
            <span>搜索用户数量</span>
            <i class="el-icon-info"></i>
          </div>
          <div class="count">
            <span>23235</span>
            <span>17.1</span>
            <svg
              t="1683166595877"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2735"
              width="16"
              height="16"
            >
              <path
                d="M194.108395 621.186771 863.223758 621.186771 528.668123 251.67295Z"
                fill="#d81e06"
                p-id="2736"
              ></path>
            </svg>
          </div>
          <div class="line">
            <lineChart />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="middle">
          <div class="desc">
            <span>搜索用户数量</span>
            <i class="el-icon-info"></i>
          </div>
          <div class="count">
            <span>23235</span>
            <span>17.1</span>
            <svg
              t="1683166646467"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3988"
              width="16"
              height="16"
            >
              <path
                d="M64 320l448 448 448-448z"
                fill="#1afa29"
                p-id="3989"
              ></path>
            </svg>
          </div>
          <div class="line">
            <lineChart />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-table style="width: 100%" border>
      <el-table-column type="index" label="label" width="80" align="center">
      </el-table-column>
      <el-table-column header-align="center" prop="prop" label="搜索关键字">
      </el-table-column>
      <el-table-column header-align="center" prop="prop" label="用户" sortable>
      </el-table-column>
      <el-table-column
        header-align="center"
        prop="prop"
        label="周涨幅"
        sortable
      >
      </el-table-column>
    </el-table>
    <el-pagination
        layout="->, prev, pager, next"
        :total="50">
    </el-pagination>
  </el-card>
</template>

<script>
import lineChart from "../../Card/Line";

export default {
  name: "hotSearch",
  components: { lineChart },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
}
.el-dropdown-link {
  cursor: pointer;
  color: black;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.desc {
  margin: 10px 0;
}
.desc span {
  margin: 0 20px;
}
.count span:first-child {
  margin: 0 40px;
}
.line {
  height: 50px;
}
</style>