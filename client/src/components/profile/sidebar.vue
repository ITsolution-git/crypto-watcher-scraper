<template>
<div>
  
    <div class="sidebar-container ">
        <div class="sidebar-title">
            Profile
        </div>
        <div class="project-list">
            <div class="project-item" :class="{'active':(activeNav == 0)}" @click="activateNav(0)">
                <div class="project-item-title"><i class="fa fa-user-circle-o"></i>User Details</div>
            </div>
            <div class="project-item" :class="{'active':(activeNav == 1)}" @click="activateNav(1)">
                <div class="project-item-title"><i class="fa fa-gear"></i>Settings</div>
            </div>
            <div class="project-item" :class="{'active':(activeNav == 2)}" @click="activateNav(2)">
                <div class="project-item-title"><i class="fa fa-bars"></i>More Settings</div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
  name: "project-sidebar",
  data() {
    return {
      hovered: -1,
      activeNav: 0,
      isLoading: true
    };
  },
  methods: {
    activateNav(nav) {
      this.activeNav = nav;
    }
  },
  computed: {
    projects() {
      return this.$store.state.projectStore.projects;
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
.project-item.active {
  background: #fff;
}
.project-item.active i {
  color: #66d0f7;
}
.project-item.active .project-item-title {
  color: #66d0f7;
}
.spinner-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 25px;
  background: #eaeaea;
}
.spinner-container i {
  color: #aaa;
}
</style>
