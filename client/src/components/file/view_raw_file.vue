<template>
    <div class="container">
        <div class="chart-main">
            <div style="width:800px; height:300px; margin-top:50px; margin-bottom:50px position:relative;">
                <StandardSelect
                    field="Chart Type"
                    :options="[{label:'Bar',value:'bar'},{label:'Line',value:'line'}]"
                    :value="{label:'Bar',value:'bar'}"
                    :onChange="changeChartType"
                    width="150px"
                    containerClass="bar-selector"
                />
                <Bar v-if="chartType == 'bar'" height="250" :chartData="chartData" :options="generateOptions()" />
                <LineChart v-if="chartType == 'line'" height="250"  :chartData="chartData" :options="generateOptions()" />
            </div>
        </div>
        <div class="option-bar-container">
       <button @click="createChart" class="modal-btn confirm"> <span v-if="!saving">Create Chart</span> <img v-if="saving" style="width:25px" src="../../img/spinner_white.svg"/></button>
       </div>
       <div class="table-container">
           <img class="spinner" v-if="!isLoaded" style="margin:50px 0px;" src="../../img/spinner.svg" alt="">
            <table v-if="isLoaded" class="sheet-table">
                <tr ><th></th><th  v-for="(row,i) in getRows()" :key="i" v-if="row.row == parseInt(2)">{{row.column}}</th></tr>
                <tr v-for="(row,i) in Object.keys(getRows())" :key="i" :id="'table-row-' + i" v-if="getRows()[row].v != null">
                    <th v-if="i < 14">{{i+1}}</th>
                    <td @click="clickCell(row2)" v-for="(row2,i2) in getRows()" :key="i2" :id="row2.column + row2.row" v-if="row2.row == parseInt(i + 1)"><div class="cell-row-tag">{{row2.column + row2.row}}</div>{{row2.w}}</td>
                </tr>
                
            </table>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import Bar from "./bar_chart";
import StandardSelect from "../form_elements/custom_select";
import LineChart from "./line_chart";
import ApiWrapper from '@/shared/utils/ApiWrapper';
export default {
  name: "raw_file",
  components: {
    Bar,
    LineChart,
    StandardSelect
  },
  data() {
    return {
      isLoaded: false,
      saving: false,
      firstClick: false,
      activeCells: [],
      lastClickedCell: "",
      allData: {},
      chartObj: {},
      chartData: {},
      chartType: "bar"
    };
  },
  methods: {
    ...mapActions(["getFile"]),
    createChart() {
      this.saving = true;
      ApiWrapper
        .put(
          "/api/files/update/" +
            this.userId +
            "/" +
            this.projectId +
            "/" +
            this.fileId,
          this.chartObj
        )
        .then(res => {
          this.saving = false;
          console.log(res);
        });
    },
    changeChartType(chart) {
      this.chartType = chart.value;
    },
    generateChartData() {
      var chartObj = {
        type: this.chartType,
        labels: [],
        data: []
      };
      var labels = [];
      var data = [];
      for (var i = 0; i < this.activeCells.length; i++) {
        var cell = this.getCell(this.activeCells[i]);
        if (cell.column == "E") {
          var title = this.getCell("D" + cell.row).v;
          chartObj.labels.push("D" + cell.row);
          chartObj.data.push("E" + cell.row);
          labels.push(title);
          data.push(cell.v);
        }
      }
      this.chartObj = chartObj;
      this.chartData = {
        labels: labels,
        datasets: [
          {
            backgroundColor: "#66d0f7",
            data,
            borderColor: "#66d0f7",
            fill: false,
            lineTension: 0
          }
        ]
      };
    },

    generateOptions() {
      return {
        responsive: true,
        legend: { display: false },
        maintainAspectRatio: false
      };
    },
    getCell(cell) {
      return this.allData[cell];
    },
    clickCell(row) {
      var cell = window.document.getElementById(row.column + row.row);
      if (event.shiftKey) {
        var lc = this.lastClickedCell.match(/[a-z]+|[^a-z]+/gi);
        var lcolumn = lc[0];
        var lrow = parseInt(lc[1]);
        if (row.column == lcolumn) {
          var diff;
          var i;
          var cellLabel;
          var cellToBeActive;
          if (parseInt(row.row) >= lrow) {
            diff = parseInt(row.row) - lrow;
            for (i = 0; i < diff; i++) {
              cellLabel = row.column + Number(parseInt(row.row) - i);
              cellToBeActive = window.document.getElementById(cellLabel);
              if (this.activeCells.indexOf(cellLabel) < 0) {
                this.activeCells.push(cellLabel);
              }
              cellToBeActive.classList = ["active"];
            }
          } else {
            diff = lrow - parseInt(row.row);
            for (i = 0; i < diff; i++) {
              cellLabel = row.column + Number(parseInt(row.row) + i);
              cellToBeActive = window.document.getElementById(cellLabel);
              if (this.activeCells.indexOf(cellLabel) < 0) {
                this.activeCells.push(cellLabel);
              }
              cellToBeActive.classList = ["active"];
            }
          }
        }
      } else {
        if (this.activeCells.indexOf(row.column + row.row) > -1) {
          this.activeCells.splice(
            this.activeCells.indexOf(row.column + row.row),
            1
          );
          cell.classList = [""];
        } else {
          this.lastClickedCell = row.column + row.row;
          this.activeCells.push(row.column + row.row);
          cell.classList = ["active"];
        }
      }
      this.generateChartData();
    },
    getRows() {
      var that = this;
      var sheet = this.file.sheet;
      var rows = sheet.Sheets[Object.keys(sheet.Sheets)[0]];
      var newRows = {};
      for (var i = 1; i < Object.keys(rows).length; i++) {
        if (Object.keys(rows[Object.keys(rows)[i]]).length > 0) {
          newRows[Object.keys(rows)[i]] = rows[Object.keys(rows)[i]];
          var label = Object.keys(rows)[i];
          var labelArr = label.match(/[a-z]+|[^a-z]+/gi);
          newRows[Object.keys(rows)[i]]["column"] = labelArr[0];
          newRows[Object.keys(rows)[i]]["row"] = labelArr[1];
        }
      }

      this.isLoaded = true;
      this.allData = newRows;
      setTimeout(function() {
        for (var p = 0; p < that.activeCells.length; p++) {
          // console.log(that.activeCells[p]);
          window.document.getElementById(that.activeCells[p]).classList = [
            "active"
          ];
        }
      }, 100);

      return newRows;
    }
  },
  mounted() {
    this.getFile({
      userId: this.userId,
      projectId: this.projectId,
      fileId: this.fileId
    }).then(res => {
      var chart = JSON.parse(JSON.stringify(res[0].chart));
      this.getRows();
      if (Object.keys(chart).length > 0) {
        this.activeCells = chart.data;
        this.generateChartData();
      }
    });
  },
  computed: {
    file() {
      return JSON.parse(JSON.stringify(this.$store.state.fileStore.file[0]));
    },
    rows() {
      var sheet = this.file;
      var rows = sheet.Sheets[Object.keys(sheet.Sheets)[0]];
      //   console.log("hit");
      //   for (var i = 1; i < Object.keys(rows).length; i++) {
      //     console.log(Object.keys(rows)[i]);
      //     console.log(rows[Object.keys(rows)[i]]);
      //   }
      return rows;
    },
    fileId() {
      return this.$route.params.fileId;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    userId() {
      return this.$store.state.user.id;
    }
  }
};
</script>
<style>
.raw-file-container {
  height: 100%;
  width: 100%;
  padding: 15px;
  background: #fff;
}
.sheet-table {
  width: 100%;
}
.sheet-table td {
  border: solid 3px #fff;
  max-width: 150px;

  cursor: pointer;
  font-size: 10pt;
  user-select: none;
  padding: 10px 5px;
  font-weight: 500;
  position: relative;
}
.sheet-table td:hover {
  transition: all 0.3s ease;
  background: #bfe7f5;
  /* box-shadow: 0px 0px 5px 0px #bfe7f5; */
}
.sheet-table td.active {
  background: #66d0f7;
  /* box-shadow: 0px 0px 5px 0px #66d0f7; */
  color: #fff;
}
.sheet-table td.active .cell-row-tag {
  opacity: 1;
  top: -7px;
}
.cell-row-tag {
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 0px;
  background: #519bb7;
  color: #fff;
  padding: 2px 3px;
  height: 16px;
  border-radius: 2px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  font-size: 8pt;
  left: -5px;
}
.chart-main {
  display: flex;
  justify-content: center;
}
.option-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin: 15px;
  border-bottom: solid 1px #aeaeae;
}
.bar-selector {
  margin-bottom: 15px !important;
}
.table-container {
  background: #f8fafb;
  padding: 15px;
  text-align: center;
  margin-bottom: 300px;
}
</style>
