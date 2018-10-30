<template>
    <div>
        <div class="no-sidebar-container">
            <div class="main-title">Search OFAC</div>
        </div>
        <div class="ofac-content">
          
          <StandardInput
            field="Email To"
            v-model="emailTos"
            width="100%"
            placeholder="john@lz.com,denny@gmail.com"
          />    

          <div class="criteria-cont">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px">
              <p>
                Criteria
              </p>
              <button @click="addCriterion()" class="modal-btn btn-white" type="submit">
                Add Criterion
              </button>
            </div>

            <div v-for="(search, index) in searches" class="criterion-cont" flex-wrap>
              <v-flex xs6>
                <StandardInput
                  field="Name"
                  v-model="search.name"
                  placeholder="japan"
                  width="100%"
                />
              </v-flex>
              <v-flex xs6>
                
              </v-flex>
              <v-flex xs6>
                
                <v-slider
                  v-model="search.minimumScore"
                  label="Minimum Score"
                  :max="100"
                  :min="50"
                  :step="1"
                  thumb-label
                ></v-slider>
              </v-flex>

              <button @click="removeCriterion(index)" class="modal-btn btn-white" type="submit">
                Remove Criterion
              </button>
            </div>
          </div>
          <button @click="startSearch()" class="modal-btn btn-white" type="submit">
            <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/>
            Request Search
          </button>
        </div>

        <div class="ofac-result">
          <div v-for="(result, index) in results" :key="index" class="ofac-result-item">
            <p>
              <span style="font-size: 18px">{{extractObj(result.search)}}</span>
            </p>
            <table class="standard-table">
              <tbody>
                <tr><th>Name</th><th>Address</th><th>Type</th><th>Program</th><th>List</th><th>Score</th></tr>
                <tr v-for="(item,i)  in result.result" :key="i">
                  <td> 
                    <span><a :href="item.link">{{item.name}}</a></span>
                  </td>
                  <td><span>{{item.address}}</span></td>
                  <td><span>{{item.type}}</span></td>
                  <td><span>{{item.program}}</span></td>
                  <td><span>{{item.list}}</span></td>
                  <td><span>{{item.score}}</span></td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>
    </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import ApiWrapper from '@/shared/utils/ApiWrapper';

export default {
  name: "ofac",
  data() {
    return {
      emailTos: '',
      searchKeys: '',
      searches: [{
        type: 'All',
        address: '',
        name: '',
        city: '',
        ID: '',
        state: '',
        program: '',
        country: '',
        minimumScore: 100,
        list: ''
      }],
      isLoading: false,
      // results: JSON.parse('[{"search":{"name":"japan","minimumScore":100},"result":[{"address":"8th Floor, Shiba East Building, 2-3-9 Shiba, Minato-ku","link":"https://sanctionssearch.ofac.treas.gov/Details.aspx?id=6674","list":"Non-SDN","name":"ASCOTEC JAPAN K.K.","program":"IRAN","score":"100","type":"Entity"}]}]')
      results: []
    };
  },
  components: {
    StandardInput
  },
  mouted() {},
  methods: {
    addCriterion() {
      this.searches.push({
        type: 'All',
        address: '',
        name: '',
        city: '',
        ID: '',
        state: '',
        program: '',
        country: '',
        minimumScore: 100,
        list: ''
      })
    },
    removeCriterion(index) {
      this.search = this.searches.splice(index, 1);
    },
    extractObj(obj) {
      let str = 'Criteria: ';
      for(let key in obj) {
        str += `${key}=${obj[key]} `;
      }
      return str;
    },
    startSearch() {
      if (!this.emailTos || !this.searches.length)
        return;
      this.results = [];
      let searches = this.searches;
      this.isLoading = true;
      ApiWrapper
        .post(
          "/api/ofac/scrap",  
          {searches: searches, emails:this.emailTos.split(',')}
        )
        .then(res => {
          alert('Email sent to ' + this.emailTos);
          this.isLoading = false;
          this.results = res.data;

        });

    }
  },
  computed: {}
};
</script>
<style>
.ofac-content {
  margin: 20px;
}
.criteria-cont {
  margin: 30px 0px;

}
.criterion-cont {
  border: 1px solid #eaeaea;
  padding: 10px;
  margin: 10px  ;
}
.ofac-result {
  margin: 20px;
}
.ofac-result-item {

  border: 1px solid #eaeaea;
  padding: 10px;
}
</style>
