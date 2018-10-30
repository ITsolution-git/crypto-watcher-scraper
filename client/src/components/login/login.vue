<template>
  <div style="overflow:hidden">
    <LearnMore v-if="learnMore" :hide="toggleLearnMore"/>
    <UserLogin :hide="toggleUserLogin" v-if="userLogin"/>
    <Signup :hide="toggleSignup" v-if="signup" />
    <div class="main-container">
      <div class="web-top-bar">
        <img  src="../../img/brain_white.svg"/>
        <i v-if="mobile" @click="toggleMobileNav" class="fa fa-bars nav-toggle"></i>
        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li @click="toggleUserLogin">User Login</li>
            <li @click="signup = !signup">Sign Up</li>
            <li><div @click="toggleLearnMore" class="get-started">Get Started</div></li>
          </ul>
        </div>
      </div>
      <div v-if="headerScroll" class="web-top-bar scrolled" :class="{'animated-fast fadeInDown': headerScroll}">
        <img  src="../../img/brain_white.svg"/>
        <i v-if="mobile" @click="toggleMobileNav" class="fa fa-bars nav-toggle"></i>
        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Company</li>
            <li><div @click="toggleLearnMore" class="get-started">Get Started</div></li>
          </ul>
        </div>
      </div>
    </div>
    <div id="login-panel" class="login-panel">
      <div class="net"></div>
      <div class="main-splash">
        <div style="flex:1; max-width:600px"><h1>Make Data Management Fun</h1><span>An easy way to collect all your data in one place.</span><br><div @click="toggleLearnMore" class="main-btn">Get Started</div></div>
        <div v-if="$mq == 'lg'" style="flex:1; display:flex;align-items:center;justify-content:center;"><img style="width:200px;" src="../../img/brain.svg" alt=""></div>

      </div>
    </div>
    <div class="wave-container">
      <img src="../../img/wave.svg" alt="">
    </div>
    <div class="section-1">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div v-if="$mq != 'sm'" class="col-sm-12">
            <img style="width:100%;" src="../../img/rait_1_1.png" alt="">
          </div>
          <div class="col-sm-12" style="display:flex;align-items:center; justify-content:center; text-align:center; color:#fff; ">
            <div>
            <h1>Visualize Your Assets</h1><br>
            <span class="sub-text">CommonBrain makes it easy to add important aspects of your business – operational, financial  and legal compliance data on our dashboard. CommonBrain is totally customizable by you so you can decide what is important to see. With the fast pace of changes for your needs, simple business tasks become complex and annoying without an easy way to edit and share your assets or asset portfolios on the fly.</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="section-2">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          
          <div class="col-sm-6" style="display:flex;align-items:center; height:400px; justify-content:center; text-align:left; ">
            <div>
            <h1>Quickly Create Webpages for your Excel Documents</h1><br>
            <span class="sub-text">With the power of CommonBrain, you can whip up fantastic web pages that display your data you want. You can then share your Business Intelligence with colleagues or just export and send in an email.  CommonBrain is a web publisher driven entirely off a simple Excel models.</span>
            </div>
          </div>
          <div v-if="$mq != 'sm'" class="col-sm-6" style="display:flex;align-items:center; height:400px; justify-content:center; text-align:center; ">
            <img src="../../img/excel_to_cb.png" style="width:100%;" alt="">
          </div>
          
        </div>
      </div>
    </div>
     <div class="section-3">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div  class="col-sm-12" style="display:flex;align-items:center;  justify-content:center; text-align:center; ">
            <img src="../../img/common_square.jpg" style="width:100%;  max-width:500px;padding-bottom:25px;" alt="">
          </div>
          <div class="col-sm-12" style="display:flex;align-items:center; justify-content:center; text-align:left; ">
            <div>
            <h1 style="text-align:center">CommonBrain Keeps Everything in One Place</h1><br>
            <span class="sub-text">CommonBrain stores, organizes and references all kinds of data, whether they are images, pdfs, or even formulas within an Excel file. If you can export data from other systems to Excel, you can integrate/link to other resources quickly and easily, from CRM to accounting software.<br><br>

            CommonBrain finds a middle ground between legacy systems and comfortable workstyles.   We allow users to store their data in one place, and publish their work on the web for easy distribution. CommonBrain was founded by principals that understand asset management, and in particular real estate asset management, from a financial, operational and legal perspective.  They have also lived through integration of popular software, with mixed success.<br><br>

            

            CommonBrain is an easy-to-use web publisher for Excel files, which allows for the curb appeal of PowerPoint with the auditability of Excel, and distributed over the internet.  CommonBrain finds a middle ground between legacy systems and comfortable workstyles.   CommonBrain connects clients’ internal data with external information.  We allow users to store their data in one place, and publish their work on the web for easy distribution.<br><br>

            

            It is very easy to deploy and does not require programming knowledge beyond Excel, and organizations can be up and running in literally minutes.  If your data is disparate, we can help integrate and tie it together for you. </span>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
    <div class="section-4">
      <div class="container" style="text-align:center">
        <h1 style="color:#fff"> Our Services</h1>
        <div class="row" style="padding-top:25px; align-items:start">
          <div class="col-sm-4" style="display:flex;align-items:center; padding-bottom:55px;  justify-content:center; text-align:center; ">
            <div class="service-container">
            <h1>Due Diligence</h1>
            <span class="sub-text">
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Lease Review</b><span style="display:inline-block;margin-left:25px;">- Loan abstracts / Rent Roll; Loan Subordination / Estoppels</span>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Third Party Reports</b>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Financial Cash Flow & Review</b><br><span style="display:inline-block;margin-left:25px;">- Cash Flow modeling / valuation <br>
            - Acquisition / Disposition analysis<br>
            - Investment analysis & waterfall</span>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Scheduled valuation updates</b>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Property Tax review</b>
            <span style="display:inline-block;margin-left:25px;">- Real estate tax search
            Tax Historical and outstanding appeal</span>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Loan Agreements</b>

            </span>
            </div>
          </div>
          <div class="col-sm-4" style="display:flex;align-items:center; padding-bottom:55px; justify-content:center; text-align:left; ">
            <div class="service-container">
            <h1>Corporate Compliance</h1>
            <span class="sub-text">
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Public record due diligence</b><span style="display:inline-block;margin-left:25px;">- Status Searches<br>Good Standing Certificate & Certified Copies
            <br>- UCC Searches and Filings
            </span>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Entity Formation</b><span style="display:inline-block;margin-left:25px;">- Single Purpose Entity<br>- Independent Director<br>- Contract Agency</span>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Public Record Compliance</b><br><span style="display:inline-block;margin-left:25px;">- Title Insurance</span>

            </span>
            </div>
          </div>
          <div class="col-sm-4" style="display:flex;align-items:center; padding-bottom:55px; justify-content:center; text-align:left; ">
            <div class="service-container">
           <h1>Collateral Monitoring, Loan Servicing</h1>
            <span class="sub-text">
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Collateral Management</b><span style="display:inline-block;margin-left:25px;">- Update lease amendments and modifications<br>
            - Set-up CAM in all standard property management systems<br>
            - RE Tax Filings <br>
            - Lease Audits; Property Inspections, <br>
            - Credit Insurance, UCC administration<br>
            </span>
            <b><i style="font-size:12pt;" class="fa fa-angle-right"></i> Loan Servicing</b><span style="display:inline-block;margin-left:25px;">- Billing & Collections<br>
            - Escrow administration<br>
            - Compliance monitoring, and loan payoff. 
            </span>
            

            </span>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div  class="col-sm-6" style="display:flex;align-items:center;  justify-content:center; text-align:center; ">
            <div class="footer-links">
              <div class="footer-link">
                About
              </div>
              <div class="footer-link">
                Company
              </div>
              <div class="footer-link">
                Learn More
              </div>
            </div>
          </div>
          <div class="col-sm-6" style="display:flex;align-items:center; justify-content:center; text-align:left; ">
            <div class="footer-links">
              <div class="footer-link">
                Benefits
              </div>
              <div class="footer-link">
                Jobs
              </div>
              <div class="footer-link">
                Privacy Policy
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import LearnMore from "./learn_more";
import UserLogin from "./login_form";
import Signup from "./signup";
import { mapActions } from "vuex";
export default {
  name: "login",
  data() {
    return {
      hasError: false,
      navOpen: false,
      errorMessage: "",
      mobile: false,
      headerScroll: false,
      learnMore: false,
      userLogin: false,
      signup: false
    };
  },

  mounted() {
    window.document.addEventListener("scroll", this.getScrollTop);
    if (this.$mq == "sm") {
      this.mobile = true;
    }
  },
  watch: {
    $mq(val) {
      if (val == "sm") {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    toggleUserLogin() {
      this.userLogin = !this.userLogin;
    },
    toggleSignup() {
      this.signup = !this.signup;
    },
    toggleLearnMore() {
      this.learnMore = !this.learnMore;
    },
    getScrollTop() {
      var scrollTop = window.window.scrollY;
      var loginPanel = window.document.getElementById("login-panel")
        .clientHeight;
      if (scrollTop > loginPanel - 100) {
        this.headerScroll = true;
      } else {
        this.headerScroll = false;
      }
    },
    toggleMobileNav() {
      this.navOpen = !this.navOpen;
    }
  },
  components: {
    StandardInput,
    LearnMore,
    UserLogin,
    Signup
  }
};
</script>
<style>
.service-container {
  text-align: center;
  color: #fff;
  background: #2ea5d4;
  padding: 25px;
}
.service-container h1 {
  font-size: 25pt;
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
}
.service-container b {
  margin-top: 45px;
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #b9ebff;
  display: inline-block;
  line-height: 20px;
}
.sub-text {
  text-align: left;
  display: inline-block;
  font-size: 14pt;
}
.footer-links {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
}
.footer-link {
  color: #fff;
  cursor: pointer;
  padding: 15px;
  font-weight: 500;
}
.section-1 {
  background: #3abaeb;
  width: 100%;
  margin-top: -1px;
  padding: 55px 15px;
}
.section-2 {
  background-image: url("../../img/neural_net2.jpg");
  background-size: cover;
  background-position: center;
  padding: 55px 15px;
  width: 100%;
}
.section-3 {
  background: #fff;
  padding: 55px 15px;
  width: 100%;
}
.section-4 {
  background: #3abaeb;
  padding: 55px 15px;
  width: 100%;
}
.footer {
  background: #4d585d;
  padding: 55px 15px;
  width: 100%;
}
.top-nav ul {
  height: 100%;
  top: 0;
  position: absolute;
  right: 0;
  padding: 15px;
  display: flex;
  align-items: center;
}
.top-nav ul li {
  padding: 15px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.top-nav ul li:hover {
  color: #b9ebff;
}
.web-top-bar {
  height: 70px;
  width: 100%;
  display: flex;
  padding: 5px 15px;
  align-items: center;
  color: #3abaeb;
  position: relative;
  z-index: 10;
}
.web-top-bar .top-nav li,
.web-top-bar .top-nav li div {
  color: #3abaeb;
  border-color: #3abaeb;
}
.web-top-bar.scrolled .top-nav li,
.web-top-bar.scrolled .top-nav li div {
  color: #fff;
  border-color: #fff;
}
.web-top-bar.scrolled {
  top: 0;
  position: fixed;
  background: #66d0f7;
  box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.2);
}
.get-started {
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 2px #ffffff;
  border-radius: 3px;
  height: 40px;
  width: 150px;
  transition: all 0.2s ease;
}
.get-started:hover {
  color: #3abaeb !important;
  background: #fff !important;
  border-color: #fff;
}
.main-splash {
  padding-top: 85px;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0px 50px;
}
.main-splash h1 {
  margin: 0;
  padding: 0;
  font-size: 55pt;
  font-weight: 200;
}
.main-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #3abaeb;
  border: solid 2px #3abaeb;
  border-radius: 3px;
  height: 40px;
  width: 150px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.main-splash span {
  display: inline-block;
  line-height: 25px;
  font-size: 15pt;
  margin-bottom: 25px;
  margin-top: 10px;
}
.main-btn:hover {
  color: #3abaeb;
  background: #fff;
  border-color: #fff;
}
@media (max-width: 1250px) {
  .service-container h1 {
    font-size: 20pt;
  }
}
@media (max-width: 728px) {
  .web-top-bar {
    /* position: absolute; */
  }
  .service-container h1 {
    font-size: 20pt;
  }
  .sub-text {
    font-size: 12pt;
  }
  i.nav-toggle {
    padding: 5px;
    font-size: 12pt;
    color: #3abaeb;
    border: solid 1px #3abaeb;
    border-radius: 3px;
    height: 35px;
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }
  .web-top-bar.scrolled i.nav-toggle {
    color: #fff;
    border: solid 1px #fff;
  }
  .top-nav ul {
    height: unset;
    background: #3abaeb;
    width: 100%;
    top: 70px;
    box-shadow: 1px 1px 10px -50px rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 0;
    flex-direction: column;
    align-items: center;
    transform: translateX(0);
    opacity: 1;
    transition: transform 0.3s ease;
  }
  .top-nav ul li,
  .top-nav ul li div {
    color: #fff !important;
    border-color: #fff !important;
  }
  .top-nav.collapsed ul {
    transform: translateX(100%);
    opacity: 0;
  }
  .top-nav.mobile ul {
  }
  .main-splash span {
    font-size: 12pt;
  }
  .main-splash {
    text-align: center;
    padding-top: unset !important;
  }
  .main-splash h1 {
    font-size: 24pt;
  }
}
</style>
