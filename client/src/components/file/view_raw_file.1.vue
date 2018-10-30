<template>
    <div class="raw-file-container">
        <div class="chart-main">
            <div style="width:500px; height:500px">
                <Bar />
            </div>
        </div>
       
        <table v-if="isLoaded" class="sheet-table">
            <tr v-for="(row,i) in Object.keys(getRows())" :key="i"><td @click="clickCell(row2)" v-for="(row2,i2) in getRows()" :key="i2" :id="row2.column + row2.row" v-if="row2.row == parseInt(i + 1)">{{row2.v}}</td></tr>
            
        </table>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import Bar from "./bar_chart";
export default {
  name: "raw_file",
  components: {
    Bar
  },
  data() {
    return {
      isLoaded: false,
      firstClick: false,
      activeCells: [],
      lastClickedCell: ""
    };
  },
  methods: {
    ...mapActions(["getFile"]),
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
    },
    getRows() {
      var sheet = this.file;
      var rows = sheet.Sheets[Object.keys(sheet.Sheets)[0]];
      var newRows = {};
      for (var i = 1; i < Object.keys(rows).length; i++) {
        if (Object.keys(rows[Object.keys(rows)[i]]).length > 0) {
          newRows[Object.keys(rows)[i]] = rows[Object.keys(rows)[i]];
          var label = Object.keys(rows)[i];
          var labelArr = label.match(/[a-z]+|[^a-z]+/gi);
          // console.log(regexStr);
          newRows[Object.keys(rows)[i]]["column"] = labelArr[0];
          newRows[Object.keys(rows)[i]]["row"] = labelArr[1];
        }

        // console.log(Object.keys(rows)[i]);
        // console.log(rows[Object.keys(rows)[i]]);
      }
      //console.log(newRows);
      this.isLoaded = true;
      return newRows;
    }
  },
  mounted() {
    this.getFile({
      userId: this.userId,
      projectId: this.projectId,
      fileId: this.fileId
    }).then(res => {
      this.getRows();
    });
  },
  computed: {
    file() {
      return JSON.parse(
        JSON.stringify(this.$store.state.fileStore.file[0].sheet)
      );
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
  border: solid 1px #000;
  max-width: 150px;
  overflow: auto;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 10pt;
  user-select: none;
  padding: 5px;
  font-weight: 500;
}
.sheet-table td:hover {
  background: #bfe7f5;
  box-shadow: 0px 0px 5px 0px #bfe7f5;
  z-index: 1000;
}
.sheet-table td.active {
  background: #66d0f7;
  box-shadow: 0px 0px 5px 0px #66d0f7;
  color: #fff;
}
.chart-main {
  display: flex;
  justify-content: center;
}
</style>
