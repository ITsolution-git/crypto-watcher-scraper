<template>
<div>
  <ExportPdf :hide="toggleExportPdf" v-if="exportPdf" />
  <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper" imgType="logo"></Cropper>
  <ReplaceFile :hide="toggleReplaceFile" :uploaded="submitReplaceFile" v-if="replaceFile" />

  
    <div class="sidebar-container">
        <div @click="$router.go(-1)" class="standard-btn back"><i class="fa fa-angle-left"></i> Back</div>
        <div class="sidebar-title" v-if="file">
          {{file.name}}
            <div class="left-sub-sidebar-options">
            <div @click.stop="toggleOptionsDropdown" class="add-project-btn dropdown-btn"><i class="fa fa-ellipsis-h" />
                <div v-click-outside="toggleOptionsDropdown"  v-if="optionsDropdown" class="basic-dropdown add-project-btn-dropdown animated-fast fadeInDown" >
                  <ul>
                    <li @click="deleteFile">Delete File</li>
                    <li @click="downloadFile">Download File</li>
                    <li @click="toggleReplaceFile">Replace File</li>
                    <li @click="toggleExportPdf">Export PDF</li>
                    <li @click.stop="toggleExportExcel">Export Excel</li>
                    <li @click.stop="toggleImageFrom" v-if="file.imageFrom=='download'">Use Image From File</li>
                    <li @click.stop="toggleImageFrom" v-if="file.imageFrom=='file'">Use Image From Upload</li>
                    <li @click.stop="toggleLogoFrom" v-if="file.logoFrom=='download'">Use Logo From File</li>
                    <li @click.stop="toggleLogoFrom" v-if="file.logoFrom=='file'">Use Logo From Upload</li>
                    <li @click="$router.push('/projects/'+projectId + '/rawfile/'+fileId)">Edit Charts</li>
                  </ul>
                </div>
            </div>
          </div>
        </div>
        <div class="file-logo">
          <div v-if="file.logoFrom == 'download'" @click="toggleCropper">
            <div class="add-image" style="padding:15px">
              <i class="fa fa-camera" style=" margin-right:10px;"></i>
              Upload
            </div>
            <img :src="logoPath" v-if="file.logo"/>
          </div>

          <div v-if="file.logoFrom == 'file'">
            <img :src="logoPath" v-if="logoPath"/>
          </div>
        </div>
        <div class="dash-nav" v-if="activeDash" @click="showSelectDash(true)">
          <span>{{activeDash.dashName}}</span>
          <i class="fa fa-angle-right" ></i>
        </div>
        <div class="file-nav">
            <ul>
                <li v-for="(sheet,i) in sheets" :key="i" :class="{'active':(activeNav == i)}" @click="activateSheet(i,sheet)">{{sheet}}</li>
            </ul>
        </div>
    </div>
    </div>
</template>
<script>
import Cropper from "./cropper";
import { deleteRequest } from "../helpers/api_helper";
import { mapActions } from "vuex";
import ApiWrapper from '@/shared/utils/ApiWrapper';
import ReplaceFile from "./replace_file";
import ExportPdf from "./export_pdf";
import ToggleImageFrom from "./toggle_import_from";

export default {
  name: "file-sidebar",
  props: ["sheets", "activate", "dashes", "activeDash", "showSelectDash", 'file', 'updateFile'],
  data() {
    return {
      hovered: 0,
      addProjectOpen: false,
      activeNav: 0,
      cropper: false,
      logoPath: "",
      optionsDropdown: false,
      replaceFile: false,
      exportPdf: false,
      imageSelect: false,

      exportExcel: false,
    };
  },
  components: {
    Cropper,
    ReplaceFile,
    ExportPdf,
    ToggleImageFrom
  },
  mounted() {
    if (this.file.logoFrom == 'file') {
      this.logoPath = this.file.logoFileUrl;
    } else if (this.file.logoFrom == 'download') {
      this.logoPath =
        "/api/static/" +
        this.$store.state.user.id +
        "/" +
        this.$route.params.projectId +
        "/" +
        this.$route.params.fileId +
        "_logo.jpg";
    }
  },
  methods: {
    ...mapActions(["getFiles"]),
    toggleExportExcel() {
      this.$emit('exportExcel');
    },
    toggleLogoFrom() {
      if (this.file.logoFrom == 'file')
        this.$emit('updateFile', {logoFrom: 'download'});
      else if (this.file.logoFrom == 'download')
        this.$emit('updateFile', {logoFrom: 'file'});
      this.optionsDropdown = false;
    },
    toggleExportPdf() {
      this.exportPdf = !this.exportPdf;
    },
    submitReplaceFile() {
      this.replaceFile = !this.replaceFile;
      window.location.reload();
    },
    toggleReplaceFile() {
      this.replaceFile = !this.replaceFile;
    },
    toggleOptionsDropdown() {
      this.optionsDropdown = !this.optionsDropdown;
    },
    toggleImageFileOrUpload() {
      this.imageSelect = !this.imageSelect;
    },
    toggleCropper: function() {
      this.cropper = !this.cropper;
    },
    toggleAddProject() {
      this.addProjectOpen = !this.addProjectOpen;
    },
    mouseOver(num) {
      this.hovered = num;
    },
    activateSheet(i, sheet) {
      this.activeNav = i;
      this.showSelectDash(false);
      this.activate(sheet);
    },
    deleteFile() {
      deleteRequest(
        "/api/files/" +
          this.$store.state.user.id +
          "/" +
          this.$route.params.projectId +
          "/" +
          this.$route.params.fileId
      ).then(() => {
        this.getFiles({ project_id: this.$route.params.projectId });
        this.$router.go(-1);
      });
    },
    downloadFile() {
      ApiWrapper
        .download(
          "/api/files/download/" +
            this.$store.state.user.id +
            "/" +
            this.$route.params.projectId +
            "/" +
            this.$route.params.fileId,
          { responseType: "arraybuffer" }
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.file[0].filename);
          document.body.appendChild(link);
          link.click();
        });
    },

    toggleImageFrom() {
      if (this.file.imageFrom == 'file')
        this.$emit('updateFile', {imageFrom: 'download'});
      else if (this.file.imageFrom == 'download')
        this.$emit('updateFile', {imageFrom: 'file'});
      this.optionsDropdown = false;
    }
  },
  computed: {
    fileId() {
      return this.$route.params.fileId;
    },
    projectId() {
      return this.$route.params.projectId;
    }
  },
  watch: {
  }
};
</script>
<style>
.file-nav {
  margin-top: 10px;
}
.file-nav li {
  padding: 10px 20px;
  font-size: 17px;
  font-weight: 600;
}
.file-nav li:hover {
  color: #66d0f7;
  cursor: pointer;
}
.file-nav li.active {
  color: #66d0f7;
  background: #fff;
}
.file-image {
  background-image: url(../../img/epic_building.jpg);
  background-size: cover;
  background-position: center;
  height: 150px;
  width: 100%;
}
.file-logo img,
.file-logo div.add-image {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef0f2;
}
.file-logo div.add-image:hover {
  cursor: pointer;
  background: #e2e5e7;
}

.dash-nav{
  margin-top: 30px;
  padding: 0px 15px;
  font-size: 20px;
  cursor: pointer;
  justify-content: space-between;
  flex-direction: row;
  display: flex;
}
.dash-nav:hover{
  color: #66d0f7;
}
.dash-nav i {
  transition: all 0.5s;
  margin-right: 10px;

}
.dash-nav:hover i {
  margin-right: 0px;
}

.standard-btn.back {
  display: inline-flex;
  position: relative;
  background: #f8fafb;
  border: solid 1px #eaeaea;
  color: #808080;
  max-width: 100px;
  margin-bottom: 15px;
  bottom: unset !important;
  margin: unset !important;
  right: unset !important;
  margin: 15px !important;
  float: none;
}
.standard-btn.back i {
  margin-right: 10px;
}
.standard-btn.back:hover {
  background: #eff1f2;
  cursor: pointer;
}
</style>
