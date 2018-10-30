<template>
  <div>
    <FileSidebar :sheets="sheets" :activate="activateSheet" :dashes="dashes" :showSelectDash="showSelectDash" :activeDash="activeDash" :file="file" @updateFile="updateFile" @exportExcel="exportExcel"/>
    
    <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper" imgType="image"></Cropper>
    <div class="projects-container" v-if="selectDashScreen" style="padding: 30px;overflow-y: auto;">
      
      <div>
        <StandardInput
          field="Search Entity"
          v-model="searchEntityKey"
          width="100%"
        />
      </div>
      <table class="standard-table">
        <tbody>
          <tr><th>Entity Name</th><th>Name2</th><th>Status</th><th>Geography</th><th>Other</th></tr>
          <tr v-for="(dash,i)  in filteredDashes" :key="i">
            <td @click="activateDash(dash)">
              <div  class="project-name">
                <i class="fa fa-building-o"></i> 
                <span>{{dash.dashName}}</span>
              </div>
            </td>
            <td><span>{{dash.name2}}</span></td>
            <td><span>{{dash.status}}</span></td>
            <td><span>{{dash.geography}}</span></td>
            <td><span>{{dash.other}}</span></td>
          </tr>
          <tr v-if="filteredDashes.length == 0">
            <td style="text-align: center" colspan="6">None</td>
          </tr>
          
        </tbody>
      </table>
    </div>

    <div class="projects-container" v-else>
      <div class="top-toolbar">
        <StandardInput
          v-model="searchMainDataKey"
          placeholder="Search..."
        />

        <div style="margin: 0px 10px; text-align: end;">
          <button @click="toggleCollapseAll" class="modal-btn btn-white" type="submit">
            {{collapseStatus  == 'collapse' ? 'Expand All' : 'Collapse All'}}
          </button>
        </div>
      </div>

      <div class="file-logo">
        <div v-if="file.imageFrom == 'download'" @click="toggleCropper">
          <div class="add-image" style="padding:15px">
            <i class="fa fa-camera" style=" margin-right:10px;"></i>
            Upload
          </div>
          <img :src="imagePath" v-if="file.image"/>
        </div>

        <div v-if="file.imageFrom == 'file'">
          <img :src="imagePath" v-if="imagePath"/>
        </div>
      </div>

      <div class="tab-container">
        <div v-for="(tab,i) in tabs" :class="{'active':(activeTab == tab)}" :key="i" @click="activateTab(i,tab)" class="tab">{{tab}}</div>
      </div>
      <div v-if="isLoading"  style="display:flex; align-items:center; justify-content:center;width:100%; height:100%;">
      <img class="spinner-big" src="../../img/spinner.svg" alt="">
      </div>
      <div v-if="!isLoading" class="main-data-container animated-fast fadeInUp">
        <div v-for="(data,i) in filteredMainData" :key="i" class="data-container">

          <div class="data-item" @click="toggleDropdown(i)">
            <i class="fa fa-minus" v-if="data.show"></i>
            <i class="fa fa-plus" v-if="!data.show"></i>
            <div class="data-title" v-html="formatWithSearch(data.title)"></div>
          </div>

          <div class="data-elements" v-if="data.show">
            <div v-for="(dat,i2) in data.data" :key="i2" class="data-item-item animated-fast fadeIn"  :class="{'left' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'l'), 'right' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'r'), 'center' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'c')} ">
              <div class="data-item-title"  v-html="formatWithSearch(dat.title)"></div>
              <div v-if="(dat.source == undefined)" class="data-item-value animated-fast fadeInUp" v-tooltip="{ content:dat.hover  , placement:'top'}"  v-html="formatWithSearch(dat.formatted)"></div>
              <div v-if="(dat.source != undefined)" class="data-item-value animated-fast fadeInUp" v-tooltip="{ content:dat.hover  , placement:'top'}"><a :href="makeLink(dat.source)"  v-html="formatWithSearch(dat.formatted)"></a></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import Cropper from "./cropper";
import FileSidebar from "./file_sidebar";
import { mapActions } from "vuex";
import StandardInput from "../form_elements/standard_input";

import ApiWrapper from '@/shared/utils/ApiWrapper';
var _ = require('lodash');

export default {
  name: "view_file",
  data() {
    return {
      dashes: [],
      tabs: [],
      rows: [],
      dashRows: [],
      mainData: {},

      activeSheet: "",
      activeTab: "",
      activeDash: "",

      isLoading: true,
      activeRows: [],
      activeData: [],
      activeSubData: [],

      selectDashScreen: false,

      searchEntityKey: "",
      searchMainDataKey: "",

      collapseStatus: 'collapse',
      imagePath: '',
      cropper: false
    };
  },
  watch: {
    searchMainDataKey(val) {
      this.toggleCollapseAll(true);
    }
  },
  methods: {
    ...mapActions(["getFile"]),
    exportExcel() {

      ApiWrapper
        .download(
          "/api/files/report/excel/" +
            this.$route.params.fileId,
          { responseType: "arraybuffer" }
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.file.filename);
          document.body.appendChild(link);
          link.click();
        });

      // let html = this.generateReportTable();

      // var table = document.createElement('div');
      // table.innerHTML = html;
      // table = table.firstChild;
      // var ws = XLSX.utils.table_to_sheet(table);
      // var wb = XLSX.utils.book_new();
      // var wscols = [
      //   {},
      //   {wch: 230},
      //   {},
      //   {},
      //   {},
      //   {},
      // ];
      // ws['!cols'] = wscols;

      // XLSX.utils.book_append_sheet(wb, ws, 'CommonBrain');

      // XLSX.writeFile(wb, this.file.name+'-Report.xlsx');
    },
    getRenderData() {

      let dashes = this.dashes.length == 0 ? [undefined] : this.dashes;
      
      let self = this;
      let renderData = dashes.map(dash=>{
        let dashRows = self.rows.filter(row=>row.dash_name == dash.dashName);
        let sheets = [];
        let sheetRows = _.groupBy(dashRows, 'sheet_name');

        for (let sheetkey in sheetRows) {
          let tabRows = _.groupBy(sheetRows[sheetkey], 'tab_name');
          let tabs = [];
          for (let tabkey in tabRows) {
            let majorCatRows = _.groupBy(tabRows[tabkey], 'major_category');
            let majorCats = [];
            for (let catkey in majorCatRows) {
              majorCats.push({name: catkey, data: majorCatRows[catkey]});
            }
            tabs.push({name: tabkey, data: majorCats});
          }
          sheets.push({name: sheetkey, data: tabs});
        }

        return {
          dash: dash,
          data: sheets
        }
      })
      return renderData;
    },
    generateReportTable() {
      let html = `<table><tr><td colspan=9>${this.file.title}</td></tr>`;
      let renderData = this.getRenderData();
      renderData.map(dash=>{
        html+=`<tr><td>${dash.dash.dashName} - ${dash.dash.name2}</td></tr>`;  
        dash.data.map(sheet=>{
          let add = '<td style="color: red"></td>';
          html+=`<tr>${add}<td>${sheet.name}</td></tr>`;  
          sheet.data.map(tab=>{

            let add = '<td></td><td></td>';
            html+=`<tr>${add}<td>${tab.name}</td></tr>`;  
            tab.data.map(majcat=>{

              let add = '<td></td><td></td><td></td>';
              html+=`<tr>${add}<td>${majcat.name}</td></tr>`;  

              for (let i = 0; i < majcat.data.length; i+=2) {
                let add = '<td></td><td></td><td></td><td></td>';

                if (i+1 < majcat.data.length) {
                  html+=`<tr>${add}<td>${majcat.data[i].spec_category}</td><td>${majcat.data[i].formatted}</td><td></td><td>${majcat.data[i+1].spec_category}</td><td>${majcat.data[i+1].formatted}</td></tr>`;  
                } else {
                  html+=`<tr>${add}<td>${majcat.data[i].spec_category}</td><td>${majcat.data[i].formatted}</td></tr>`;  
                }
              }
            })
          })
        })
      })
      return html + '</table>';
    },
    updateFile(fields) {

      ApiWrapper
        .put(
          "/api/files/update/" +
            this.userId +
            "/" +
            this.projectId +
            "/" +
            this.fileId,
          fields
        )
        .then(res => {
          // this.loadFile();
          window.location.reload();
        });

    },
    round(data) {
      if (typeof data == "number") {
        return Math.round(data);
      } else {
        return data;
      }
    },
    makeLink(link) {
      if (link.indexOf("http") < 0) {
        return "http://" + link;
      } else {
        return link;
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    format(value) {
      if (typeof value == "number") {
        return this.numberWithCommas(value);
      } else {
        return value;
      }
    },
    getRows() {
      if (this.file.dashes) {
        for (let key in this.file.dashes) {
          this.dashes.push(this.file.dashes[key]);
        }
      }

      for (var i = 0; i < Object.keys(this.file.rows).length; i++) {
        this.rows.push(this.file.rows[Object.keys(this.file.rows)[i]]);
      }

      if (this.dashes.length > 0) {
        this.activateDash(this.dashes[0]);
        this.showSelectDash(true);
      } else {
        this.dashRows = this.rows;
        if (this.dashRows.length > 0) {
          this.activeSheet = this.dashRows[0].sheet_name;
          this.activateSheet(this.activeSheet);
        }
      }
      this.isLoading = false;
    },
    activateDash(dash) {
      this.activeDash = dash;
      this.dashRows = this.rows.filter(row=>row.dash_name == dash.dashName);
      if (this.dashRows.length > 0) {
        this.activeSheet = this.dashRows[0].sheet_name;
        this.activateSheet(this.activeSheet);

      } else {

        this.activeSheet = "";
        this.activeRows = [];
        this.activeData = [];
        this.tabs = [];
        this.mainData = [];
      }
      this.showSelectDash(false);
    },
    activateSheet(sheet) {
      var that = this;
      this.isLoading = true;
      setTimeout(function() {
        that.activeSheet = sheet;
        that.activeRows = [];
        that.activeData = [];
        that.getTabs(sheet).then(res => {
          that.activeTab = res;
          that.getData(res);
        });
      }, 10);
    },
    activateTab(i, tab) {
      this.isLoading = true;
      this.activeTab = tab;
      this.activeData = [];
      this.mainData = {};
      this.getData(tab);
    },
    showSelectDash (val) {
      this.selectDashScreen = val;
    },
    getTabs(sheet) {
      this.activeData = [];
      var that = this;
      return new Promise(function(resolve, reject) {
        var tabs = [];
        for (var i = 0; i < that.dashRows.length; i++) {
          if (that.dashRows[i].sheet_name == sheet) {
            that.activeRows.push(that.dashRows[i]);
            if (tabs.indexOf(that.dashRows[i].tab_name) < 0) {
              tabs.push(that.dashRows[i].tab_name);
            }
          }
        }
        resolve(tabs[0]);
        that.tabs = tabs;
        //that.isLoading = false;
      });
    },
    getData(tab) {
      this.mainData = [];
      let mainData = {};
      for (let i = 0; i < this.activeRows.length; i++) {
        if (this.activeRows[i].tab_name == tab) {
          
          this.activeData[i] = this.activeRows[i];
          let majorCat = this.activeData[i].major_category
          var obj = {};
          if (!mainData[majorCat]) {
            mainData[majorCat] = {
              title: majorCat,
              data: []
            }
          }

          mainData[majorCat].data.push({
            title: this.activeRows[i].spec_category,
            value: this.activeRows[i].value,
            formatted: this.activeRows[i].formatted,
            hover: this.activeRows[i].hover,
            maj: this.activeRows[i].major_category,
            source: this.activeRows[i].source,
            just: this.activeRows[i].justification
          });

        }
      }
      this.isLoading = false;
      // this.mainData = mainData;
      for(let key in mainData) {
        this.mainData.push({
          title: mainData[key].title,
          data: this.sortDataByJust(mainData[key].data)
        });
      }

    },

    //sorting by just
    sortDataByJust(data) {
      let target = [];
      while(data.length > 0) {
        let item = data.splice(0,1)[0];
        if (item.just && item.just.charAt(0).toLowerCase() == 'r') {
          let lastel = target[target.length - 1];
          if (lastel && (
            !lastel.just || (lastel.just && lastel.just.charAt(0).toLowerCase() == 'l'))) { // if prev is left

            target[target.length - 1].just = '';
            target.push({...item, just: ''});
          } else {
            target.push(item);
          }
        } else {
          target.push(item);
        }
        //   let len = target.length;
        //   if (len % 2 == 0) { //find left
        //     for (var i = 0; i < data.length; i++) {
        //       data[i]
        //     }
        //   }
        // } else {
        //   target.push(data.unshift());
        // }
        
      }
      return target;
    },
    toggleDropdown (i) {
      this.mainData = this.mainData.map((item, index)=>{
        if (index == i)
          return {
            ...item,
            show: !item.show
          };
        else return item;
      });
      if (this.mainData.map(item=>item.show).indexOf(true) == -1)
        this.collapseStatus = 'collapse';
      else
        this.collapseStatus = 'expand';
    },

    toggleCollapseAll(force) {
      let toToggle = true;
      if (typeof force == 'boolean')
        toToggle = force;
      else {
        this.mainData.map((item, index)=>{
          if (item.show)
            toToggle = false;
        });
      }

      this.mainData = this.mainData.map((item, index)=>{
        
        return {
          ...item,
          show: toToggle
        };
      });
      if (this.mainData.map(item=>item.show).indexOf(true) == -1)
        this.collapseStatus = 'collapse';
      else
        this.collapseStatus = 'expand';
    },
    formatWithSearch(str) {
      if (!this.searchMainDataKey)
        return str;
      else {
        let match = new RegExp("(" + this.searchMainDataKey + ")","gi"); 
        return str.replace(match, "<span style='background-color: #FFFF00'>$1</span>")
      }
    },
    loadFile() {
      this.getFile({
        userId: this.userId,
        projectId: this.projectId,
        fileId: this.fileId
      }).then(res => {
        this.getRows();

        if (this.file.imageFrom == 'file') {
          this.imagePath = this.file.imageFileUrl;
        } else if (this.file.imageFrom == 'download') {
          this.imagePath =
            "/api/static/" +
            this.$store.state.user.id +
            "/" +
            this.$route.params.projectId +
            "/" +
            this.$route.params.fileId +
            "_image.jpg";
        }
      });
    },
    toggleCropper() {
      this.cropper = !this.cropper;
    },
  },
  computed: {
    file() {
      return this.$store.state.fileStore.file[0] ? Object.assign({}, this.$store.state.fileStore.file[0]) : {}; 
    },
    sheets() {
      var sheetArr = [];
      for (var i = 0; i < this.dashRows.length; i++) {
        if (sheetArr.indexOf(this.dashRows[i].sheet_name) < 0) {
          sheetArr.push(this.dashRows[i].sheet_name);
        }
      }
      return sheetArr;
    },
    fileId() {
      return this.$route.params.fileId;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    userId() {
      return this.$store.state.user.id;
    },

    filteredDashes() {
      if (!this.searchEntityKey)
        return this.dashes;
      return this.dashes.filter(dash=>{
        let str = dash.dashName + ' ' + dash.name2 + ' ' + dash.status + ' ' + dash.geography + ' ' + dash.other;
        if (str.toLowerCase().indexOf(this.searchEntityKey.toLowerCase()) != -1)
          return true;
        return false;
      })
    },
    filteredMainData() {
      return this.mainData;
      //Removed for now to show all search result, and just highlights
      if (!this.searchMainDataKey)
        return this.mainData;

      let that = this;
      return this.mainData.map(item=>{
        if (item.title.toLowerCase().indexOf(that.searchMainDataKey.toLowerCase()) != -1)
          return item;
        return {
          ...item,
          data: item.data.filter(dat=>{

            let str = dat.formatted + ' ' + dat.title + ' ' + dat.hover;
            if (str.toLowerCase().indexOf(that.searchMainDataKey.toLowerCase()) != -1)
              return true;
            return false;   
          })
        }
      })
    },
  },
  mounted() {
    this.loadFile()
  },
  components: {
    FileSidebar,
    StandardInput,
    Cropper
  }
};
</script>
<style>
.tab-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 10px;
  border-bottom: solid 1px #eaeaea;
  box-shadow: inset -9px -18px 10px -20px rgba(0, 0, 0, 0.2);
  padding-left: 15px;
  background: #f8fafb;
}
.tab {
  background: #fff;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  border: solid 1px #eaeaea;
  height: 50px;
  font-size: 10pt;
  padding: 10px;
  flex: 1;
  max-width: 200px;
  width: 100%;
  font-weight: 500;
  color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px -5px 8px -5px rgba(0, 0, 0, 0.1);
  margin-right: 5px;
  margin-bottom: -1px;
}
.tab:hover {
  cursor: pointer;
  color: #000;
}
.tab.active {
  color: #66d0f7;
  border-bottom: none;
}
.data-container {
  padding: 15px;
  width: 100%;
  flex-basis: 50%;
  min-width: 500px;
  flex-grow: 1;
}
.data-title {
  font-size: 15pt;
  color: #000;
  margin-left: 20px;
}
.data-elements {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}


.data-item {
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: flex-start;
  border-bottom: solid 1px #eaeaea;
  cursor: pointer;
  align-items: center;
}
.data-item-item {
  display: flex;
  flex-wrap: wrap;
  min-width: 250px;
  margin: 10px;
  background: #fff;
  flex-basis: calc(50% - 30px);
  min-height: 30px;
  border-bottom: solid 1px #eaeaea;
}
/* .data-item-item:nth-child(odd) {
  margin-right: 15px;
} */
.data-item-title {
  font-weight: 500;
}
.data-item-value {
  margin-left: auto;
}
.data-item-value a {
  color: #00bbff;
}
.main-data-container {
  /* display: flex; */
  /*max-width: 1200px;*/
  flex-wrap: wrap;
  margin-top: 25px;
  height: calc(100vh - 180px);
  overflow: auto;
}
.data-container {
}
.left {
  margin-right: 50%;
}
.right {
  margin-left: 50%;
}
.center {
  flex: auto;
  width: 100%;
  padding: 0px 25%;
}
.center .data-item-title {

}

.btn-white {
  background: #fff;
  color: #66d0f7;
  padding: 5px, 10px;
}
.btn-white:hover {
  color: #fff;
  background: #66d0f7;
}
.top-toolbar {
  margin: 10px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center
}
</style>
