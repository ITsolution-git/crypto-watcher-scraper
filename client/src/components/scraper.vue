<template>
  <div style="margin: 20px; ">
    <div style="width: 100%;display: flex;justify-content: center;align-items: center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="purple"
        indeterminate
        v-if="loading"
      ></v-progress-circular>
    </div>
    <v-layout row wrap v-if="!loading">
      <v-flex xs3 style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            Price
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td></td>
                <td>BTC</td>
                <td>ETH</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Coinbase USD</td>
                <td>{{format(priceTable.coinbase.BTC, 'normal')}}</td>
                <td>{{format(priceTable.coinbase.ETH, 'normal')}}</td>
              </tr>
              <tr>
                <td>Bitstamp USD</td>
                <td>{{format(priceTable.bitstamp.BTC, 'normal')}}</td>
                <td>{{format(priceTable.bitstamp.ETH, 'normal')}}</td>
              </tr>
              <tr style="background: #9dc4e7; font-weight: : 900">
                <td>Average USD</td>
                <td>{{format( (priceTable.coinbase.BTC + priceTable.bitstamp.BTC)/2, 'normal')}}</td>
                <td>{{format( (priceTable.coinbase.ETH + priceTable.bitstamp.ETH)/2, 'normal')}}</td>
              </tr>
              <tr>
                <td>Bitfinex</td>
                <td>{{format(priceTable.bitfinex.BTC, 'normal')}}</td>
                <td>{{format(priceTable.bitfinex.ETH, 'normal')}}</td>
              </tr>
              <tr>
                <td>Binance</td>
                <td>{{format(priceTable.binance.BTC, 'normal')}}</td>
                <td>{{format(priceTable.binance.ETH, 'normal')}}</td>
              </tr>
              <tr style="background: #9dc4e7; font-weight: : 900">
                <td>Average USD</td>
                <td>{{format( (priceTable.bitfinex.BTC + priceTable.binance.BTC)/2, 'normal')}}</td>
                <td>{{format( (priceTable.bitfinex.ETH + priceTable.binance.ETH)/2, 'normal')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>



      <v-flex xs9  style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            Cold Wallets
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td>Wallet</td>
                <td>BTC(coins)</td>
                <td>ETH(coins)</td>
                <td>ERC-20(USD-mi)</td>
                <td>Tether(USD-mi)</td>
                <td>Sum converted in BTCs</td>
                <td>Total%</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ex in ['bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'poloniex']">
                <td>{{ex.slice(0,1).toUpperCase() + ex.slice(1)}}</td>
                <td>{{format(today.bitcoin[ex], 'normal')}}</td>
                <td>{{format(today.ethereum[ex], 'normal')}}</td>
                <td>{{format(today.erc20usd[ex], 'mi')}}</td>
                <td>{{format(today.tether[ex]  ? today.tether[ex] : 0, 'mi')}}</td>
                <td style="background: #0d3863; color: #ffffff">{{format(today.sum[ex], 'normal')}}</td>
                <td>{{format(today.sum[ex]/coldWallet.total.sum*100, 'normal')}}%</td>
              <tr>
              <tr style="background: #9dc4e7; font-weight: : 900">
                <td>Total</td>
                <td>{{format(coldWallet.total.bitcoin, 'normal')}}</td>
                <td>{{format(coldWallet.total.ethereum, 'normal')}}</td>
                <td>{{format(coldWallet.total.erc20usd, 'mi')}}</td>
                <td>{{format(coldWallet.total.tether, 'mi')}}</td>
                <td>{{format(coldWallet.total.sum, 'normal')}}</td>
                <td>{{format(100.00, 'normal')}}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>


      <v-flex xs3 style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            Tether Discount
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td></td>
                <td>BTC</td>
                <td>ETH</td>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #1b4388; color:#d8e74a; ">
                <td>Real-Time</td>
                <td>{{format((priceTable.coinbase.BTC/priceTable.bitfinex.BTC + priceTable.coinbase.BTC/priceTable.binance.BTC)/2, 'normal')}}</td>
                <td>{{format((priceTable.coinbase.ETH/priceTable.bitfinex.ETH + priceTable.coinbase.ETH/priceTable.binance.ETH)/2, 'normal')}}</td>
              </tr>

              <tr>
                <td>1 hour ago</td>
                <td>{{format((priceTable1h.coinbase.BTC/priceTable1h.bitfinex.BTC + priceTable1h.coinbase.BTC/priceTable1h.binance.BTC)/2, 'normal')}}</td>
                <td>{{format((priceTable1h.coinbase.ETH/priceTable1h.bitfinex.ETH + priceTable1h.coinbase.ETH/priceTable1h.binance.ETH)/2, 'normal')}}</td>
              </tr>

              <tr>
                <td>1 day ago</td>
                <td>{{format((priceTable1d.coinbase.BTC/priceTable1d.bitfinex.BTC + priceTable1d.coinbase.BTC/priceTable1d.binance.BTC)/2, 'normal')}}</td>
                <td>{{format((priceTable1d.coinbase.ETH/priceTable1d.bitfinex.ETH + priceTable1d.coinbase.ETH/priceTable1d.binance.ETH)/2, 'normal')}}</td>
              </tr>
              <tr>
                <td>7 days ago</td>
                <td>{{format((priceTable7d.coinbase.BTC/priceTable7d.bitfinex.BTC + priceTable7d.coinbase.BTC/priceTable7d.binance.BTC)/2, 'normal')}}</td>
                <td>{{format((priceTable7d.coinbase.ETH/priceTable7d.bitfinex.ETH + priceTable7d.coinbase.ETH/priceTable7d.binance.ETH)/2, 'normal')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>




      <v-flex xs7 style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            Total Changes in BTC Terms
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td></td>
                <td>1 day ago</td>
                <td>15 days ago</td>
                <td>45 days ago</td>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #1b4388; color:#d8e74a; ">
                <td>Total</td>
                <td>{{format(totalChanges.day1, 'normal'), 'normal'}}</td>
                <td>{{format(totalChanges.day15, 'normal'), 'normal'}}</td>
                <td>{{format(totalChanges.day30, 'normal'), 'normal'}}</td>
              </tr>
              <tr v-for="ex in ['bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'poloniex']">
                <td>{{ex.slice(0,1).toUpperCase() + ex.slice(1)}}</td>
                <td>{{format(day1.sum[ex] - today.sum[ex], 'normal')}}</td>
                <td>{{format(day15.sum[ex] - today.sum[ex], 'normal')}}</td>
                <td>{{format(day30.sum[ex] - today.sum[ex], 'normal')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>


      <v-flex xs2 style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            BTC Bitfinex Funding
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td>Rate</td>
                <td>Texa/no</td>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #1b4388; color:#d8e74a; ">
                <td>Real Time</td>
                <td>{{format((Math.pow(1 + (1/priceTable.bitfinex.BTC), 360) - 1) * 100, 'normal')}}</td>
              </tr>
              <tr>
                <td>7 days ago</td>
                <td>{{format((Math.pow(1 + (1/priceTable7d.bitfinex.BTC), 360) - 1) * 100, 'normal')}}</td>
              </tr>
              <tr>
                <td>15 days ago</td>
                <td>{{format((Math.pow(1 + (1/priceTable15d.bitfinex.BTC), 360) - 1) * 100, 'normal')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>




      <v-flex xs4 style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            Outstanding Tethers
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td></td>
                <td>Tethers(millon coins)</td>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #1b4388; color:#d8e74a; ">
                <td>Issued</td>
                <td>{{format((tethertotal), 'normal')}}</td>
              </tr>
              <tr>
                <td>Quarantined Tether</td>
                <td>-{{format(outTether.quar, 'normal')}}</td>
              </tr>
              
              <tr>
                <td>Cancelled</td>
                <td>-{{format(today.tether['treasury'], 'normal')}}</td>
              </tr>
              <tr>
                <td>ERC-20 Tethers</td>
                <td>{{format(outTether.auth-outTether.notIssued, 'normal')}}</td>
              </tr>
              <tr  style="background: #9dc4e7; font-weight: : 900">
                <td>Outstanding</td>
                <td>{{format(tethertotal - (outTether.quar ? outTether.quar : 0) - today.tether['treasury'] - (outTether.auth-outTether.notIssued), 'normal')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>



      <v-flex xs7 style="padding: 10px">
        <div class="scraper-table-cont">
          <div style="background: #a9d18d; padding: 10px; margin-bottom: 10px; text-align: center; font-weight: bold">
            Tether Holders
          </div>
          <table class="scraper-table">
            <thead>
              <tr>
                <td></td>
                <td>1 day ago</td>
                <td>15 days ago</td>
                <td>45 days ago</td>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #1b4388; color:#d8e74a; ">
                <td>Outstanding</td>
                <td>{{format(tetherHolders.day1, 'normal'), 'mi'}}</td>
                <td>{{format(tetherHolders.day15, 'normal'), 'mi'}}</td>
                <td>{{format(tetherHolders.day30, 'normal'), 'mi'}}</td>
              </tr>
              <tr v-for="ex in ['treasury', 'bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'poloniex']">
                <td>{{ex.slice(0,1).toUpperCase() + ex.slice(1)}}</td>
                <td>{{format(day1.tether[ex] - today.tether[ex], 'mi')}}</td>
                <td>{{format(day15.tether[ex] - today.tether[ex], 'mi')}}</td>
                <td>{{format(day30.tether[ex] - today.tether[ex], 'mi')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>

    </v-layout>
  </div>
</template>
<script>

import { mapActions } from "vuex";
import axios from 'axios'
import ApiWrapper from '@/shared/utils/ApiWrapper';
export default {
  name: "sraper",
  data() {
    return {
      loading: true,
      today: null,
      day1: null,
      day15: null,
      day30: null,

      rates: null,
      priceTable: null,
      priceTable1h: null,
      priceTable1d: null,
      priceTable7d: null,
      priceTable15d: null,

      coldWallet: null,
      totalChanges: null,
      outTether: null,
      tetherHolders: null
    };
  },

  mounted() {
    Promise.all([
      ApiWrapper.get('/api/files/scraper-data').then(res=>res.data),
      // axios({
      //   method: 'get',
      //   url: 'https://api.bitfinex.com/v2/trades/fBTC/hist?start=172800000',
      //   json: true
      // }).then(data => data)
    ]).then(data=>{
      this.parseDBData(data[0]);
    })
  },
  watch: {
  },
  methods: {
    parseItem(item) {
      if(!item)
        return null;
      let res = { bitcoin: {}, ethereum: {}, erc20usd: {}, tether: {}, sum: {}};
      let key;
      for (key in item.bitcoin) {
        res.bitcoin[key] = item.bitcoin[key].reduce((i1, i2) => i1+i2.balance, 0);
      }
      for (key in item.ethereum) {
        res.ethereum[key] = item.ethereum[key].reduce((i1, i2) => i1+i2.balance, 0);
      }
      for (key in item.ethereum) {
        res.erc20usd[key] = item.ethereum[key].reduce((i1, i2) => i1+i2.erc20.usd, 0);
      }
      for (key in item.tether) {
        res.tether[key] = item.tether[key].reduce((i1, i2) => i1+i2.balance, 0);
      }
      let self = this;

      ['bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'poloniex'].map(ex=>{
        res.sum[ex] = (res.bitcoin[ex] ? res.bitcoin[ex] : 0) + (res.ethereum[ex]*self.rates[1].ask ? res.ethereum[ex]*self.rates[1].ask : 0) + (res.erc20usd[ex]/self.rates[0].ask ? res.erc20usd[ex]/self.rates[0].ask : 0) + (res.tether[ex] ? res.tether[ex]/self.rates[0].ask : 0);
      })
      return res;
    },
    parseDBData(data) {

      this.rates = data.today.rates;
      this.priceTable = data.priceTable;
      this.priceTable1h = data.priceTable1h;
      this.priceTable1d = data.priceTable1d;
      this.priceTable7d = data.priceTable7d;
      this.priceTable15d = data.priceTable15d;
      this.tethertotal = data.tethertotal;

      this.today = this.parseItem(data.today);
      this.day1 = this.parseItem(data.day1);
      this.day15 = this.parseItem(data.day15);
      this.day30 = this.parseItem(data.day30);

      this.outTether = data.today.outTether;

      let self = this;
      this.coldWallet = { total: { bitcoin: 0, ethereum: 0, tether: 0, erc20usd: 0, sum: 0}};
      ['bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'polonix'].map(ex=>{
        self.coldWallet.total.bitcoin += self.today.bitcoin[ex] ? self.today.bitcoin[ex] : 0;
        self.coldWallet.total.ethereum += self.today.ethereum[ex] || 0;
        self.coldWallet.total.erc20usd += self.today.erc20usd[ex]  || 0;
        self.coldWallet.total.tether += self.today.tether[ex] || 0;
        self.coldWallet.total.sum += self.today.sum[ex] || 0;
      })
      

      self.totalChanges = { day1:0, day15:0, day30:0 };
      ['bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'poloniex'].map(ex=>{
        self.totalChanges.day1 += self.day1.sum[ex] - self.today.sum[ex];
        self.totalChanges.day15 += self.day15.sum[ex] - self.today.sum[ex];
        self.totalChanges.day30 += self.day30.sum[ex] - self.today.sum[ex];
      });


      self.tetherHolders = { day1:0, day15:0, day30:0 };
      ['treasury', 'bitfinex', 'binance', 'bittrex', 'huobi', 'kraken', 'poloniex'].map(ex=>{
        self.tetherHolders.day1 += self.day1.tether[ex] - self.today.tether[ex];
        self.tetherHolders.day15 += self.day15.tether[ex] - self.today.tether[ex];
        self.tetherHolders.day30 += self.day30.tether[ex] - self.today.tether[ex];
      });

      this.loading = false;
    },
    format(num, type) {
      if (!num)
        return 0;
      if (type == 'mi') {
        num = num / 1000000;
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      if (type == 'normal') {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    }
  },
  components: {
  }
};
</script>
<style>
.scraper-table-cont {
  width: 100%;
}
.scraper-table {
  width: 100%;
}

.scraper-table thead td{
  font-weight: bold;
  background: #d9d9d9;
}
</style>
