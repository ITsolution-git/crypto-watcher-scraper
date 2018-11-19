var rp = require('request-promise');
require('dotenv').config();
const ccxt = require ('ccxt')

const Nightmare = require('nightmare');
let binanceEx = new ccxt['binance']();
let bitfinexEx = new ccxt['bitfinex']();
let coinbaseEx = new ccxt['coinbase']();
let bitstampEx = new ccxt['bitstamp']();
var moment = require('moment');
var URL = process.env.MONGO_URL;

var MongoClient = require("mongodb").MongoClient;
addresses = {
	bitcoin: {
		binance: [{
			address: '16ftSEQ4ctQFDtVZiUBusQUjRrGhM3JYwe',
		},{
			address: '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
		},{
			address: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
		}],
		bitfinex: [{
			address: '3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r',
		}],
		bittrex: [{
			address: '16rCmCmbuWDhPjWTrpQGaU3EPdZF7MTdUk',
		},{
			address: '1N52wHoVR79PMDishab2XmRHsbekCdGquK',
		}],
		huobi: [{
			address: '3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64',
		}],
		kraken: [{
			address: '1AnwDVbwsLBVwRfqN2x9Eo4YEJSPXo2cwG',
		},{
			address: '1Kd6zLb9iAjcrgq8HzWnoWNVLYYWjp3swA',
		},{
			address: '14eQD1QQb8QFVG8YFwGz7skyzsvBLWLwJS',
		},{
			address: '1A7znRYE24Z6K8MCAKXLmEvuS5ixzvUrjH',

		}]
	},
	ethereum: {
		binance: [{
			address: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
		},{
			address: '0xd551234ae421e3bcba99a0da6d736074f22192ff',
		},{
			address: '0x564286362092d8e7936f0549571a803b203aaced',
		},{
			address: '0x0681d8db095565fe8a346fa0277bffde9c0edbbf',
		},{
			address: '0xfe9e8709d3215310075d67e3ed32a380ccf451c8',
		}],
		bitfinex: [{
			address: '0x1151314c646ce4e0efd76d1af4760ae66a9fe30f',
		},{
			address: '0x7727e5113d1d161373623e5f49fd568b4f543a9e',
		},{
			address: '0x4fdd5eb2fb260149a3903859043e962ab89d8ed4',
		},{
			address: '0x876eabf441b2ee5b5b0554fd502a8e0600950cfa',
		},{
			address: '0x742d35cc6634c0532925a3b844bc454e4438f44e',
		}],
		bittrex: [{
			address: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
		},{
			address: '0xe94b04a0fed112f3664e45adb2b8915693dd5ff3',
		}],
		huobi: [{
			address: '0xab5c66752a9e8167967685f1450532fb96d5d24f',
		},{
			address: '0xe93381fb4c4f14bda253907b18fad305d799241a',
		},{
			address: '0xfa4b5be3f2f84f56703c42eb22142744e95a2c58',
		},{
			address: '0x46705dfff24256421a05d056c29e81bdc09723b8',
		},{
			address: '0x99fe5d6383289cdd56e54fc0baf7f67c957a8888',
		},{
			address: '0x1b93129f05cc2e840135aab154223c75097b69bf',
		},{
			address: '0xeb6d43fe241fb2320b5a3c9be9cdfd4dd8226451',
		},{
			address: '0x956e0dbecc0e873d34a5e39b25f364b2ca036730',
		},{
			address: '0x6748f50f686bfbca6fe8ad62b22228b87f31ff2b',
		},{
			address: '0xfdb16996831753d5331ff813c29a93c76834a0ad',
		},{
			address: '0xeee28d484628d41a82d01e21d12e2e78d69920da',
		},{
			address: '0x5c985e89dde482efe97ea9f1950ad149eb73829b',
		},{
			address: '0xdc76cd25977e0a5ae17155770273ad58648900d3',
		},{
			address: '0xadb2b42f6bd96f5c65920b9ac88619dce4166f94',
		},{
			address: '0xa8660c8ffd6d578f657b72c0c811284aef0b735e',
		},{
			address: '0x1062a747393198f70f71ec65a582423dba7e5ab3',
		}],
		kraken: [{
			address: '0x2910543af39aba0cd09dbb2d50200b3e800a63d2',
		},{
			address: '0x0a869d79a7052c7f1b55a8ebabbea3420f0d1e13',
		},{
			address: '0xe853c56864a2ebe4576a807d26fdc4a0ada51919',
		},{
			address: '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0',
		},{
			address: '0xfa52274dd61e1643d2205169732f29114bc240b3',
		}],
		poloniex: [{
			address: '0x32be343b94f860124dc4fee278fdcbd38c102d88',
		},{
			address: '0xab11204cfeaccffa63c2d23aef2ea9accdb0a0d5',
		},{
			address: '0x209c4784ab1e8183cf58ca33cb740efbf3fc18ef',
		},{
			address: '0xb794f5ea0ba39494ce839613fffba74279579268',
		},{
			address: '0x0536806df512d6cdde913cf95c9886f65b1d3462',
		}],
		hitbtc: [{
			address: '0x9c67e141c0472115aa1b98bd0088418be68fd249',
		},{
			address: '0x59a5208b32e627891c389ebafc644145224006e8',
		},{
			address: '0xa12431d0b9db640034b0cdfceef9cce161e62be4',
		}],
		okex: [{
			address: '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b',
		},{
			address: '0x236f9f97e0e62388479bf9e5ba4889e46b0273c3',
		}]
	},
	tether: {
		treasury: [{
			address: '1NTMakcgVwQpMdGxRQnFKyb3G1FAJysSfz',
		}],
		binance: [{
			address: '1KQ4DHSvR4zN5ZEQS9SfV71DK5rwm529KG',
		}],
		bitfinex: [{
			address: '1KYiKJEfdJtap9QX2v9BXJMpz2SfU4pgZw',
		}],
		bittrex: [{
			address: '1DUb2YYbQA1jjaNYzVXLZ7ZioEhLXtbUru',
		}],
		huobi: [{
			address: '1HckjUpRGcrrRAtFaaCAUaGjsPx9oYmLaZ',
		},{
			address: '1LAnF8h3qMGx3TSwNUHVneBZUEpwE4gu3D',
		},{
			address: '168o1kqNquEJeR9vosUB5fw4eAwcVAgh8P',
		}],
		kraken: [{
			address: '3GyeFJmQynJWd8DeACm4cdEnZcckAtrfcN',
		}],
		poloniex: [{
			address: '1A9AUhKv6aLrKGAdwMM9aHXECZM9uQivZK',
		},{
			address: '1G6jMfQotd6rV8VkMFNx4hPXYHioeBdquf',
		},{
			address: '1AanEM2PU6GS7krwxaysKP3scwb3fdioyE',
		},{
			address: '1LJjvsEN9ZzeBVPB4XbhS7mxg99gBAPoMB',
		},{
			address: '1A6yDZj1241qtGzEeQWRaptxVEhzz5owLP',
		},{
			address: '1Hi1hyJpUeETGBTQ8aPZ69GBL8xBVV53XP',
		},{
			address: '1Po1oWkD2LmodfkBYiAktwh76vkF93LKnh',
		}],
		hitbtc: [{
			address: '15Fkf4K6z6XQXr1xoNBDDTaR9GBMX6JdyF'
		}],
		okex: [{
			address: '37Tm3Qz8Zw2VJrheUUhArDAoq58S6YrS3g',
		}]
	},

	priceTable: {

	}
}

const wait = async (timeout) => {
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve();
		}, timeout);
	})
}

async function saveData(data) {

	return new Promise((resolve, reject)=> {
		MongoClient.connect(URL, function(err, db) {
			if (err) throw err;
			var collection = db.collection("files");
			collection
			.insert(data)
			.then(
				result => {
					resolve(result);
				},
				err => {
					reject(err);
				}
			);
			// collection
			// .find({ _id: ObjectId(fileId) }, { sheet: 0 })
			// .toArray()
			// .then(result => {
			// 	res.download('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + (result[0].filepath ? result[0].filepath : result[0].filename))
			// });
		});
	});
}
async function getOutTether() {

	const nightmare = Nightmare({ 
		show: false,
		waitTimeout: 1000*60*2
	})
	return nightmare
	.goto('https://wallet.tether.to/transparency')
	.wait(1000 * 5)
	.wait('.tpr-breakdown table tr')
	.evaluate(() => {
		let quar = document.querySelector('.tpr-breakdown').querySelectorAll('table tr')[5].querySelector('td').innerHTML;
		let auth = document.querySelector('.tpr-breakdown').querySelectorAll('table tr')[7].querySelector('td').innerHTML;
		let notIssued = document.querySelector('.tpr-breakdown').querySelectorAll('table tr')[8].querySelector('td').innerHTML;

		return {quar: parseFloat(quar.replace(/[,$-\s]/g, '')), auth: parseFloat(auth.replace(/[,$-\s]/g, '')), notIssued: parseFloat(notIssued.replace(/[,$-\s]/g, '')) };
		// return document.querySelector('.tpr-breakdown').querySelectorAll('table tr')[7].innerHTML;
	})
	.end()
	.then((res)=>{
		console.log(res);
		return res;
	})
	.catch(error => {
		console.error('Search failed:', error)
		throw error;
	})
}

async function getERC20Balance(addr) {

	const nightmare = Nightmare({ 
		show: false,
		waitTimeout: 1000*60*2
	})
	return nightmare
	.goto('https://etherscan.io/tokenholdings?a=' + addr)
	.wait(1000 * 5)
	.wait('#HoldingsETH')
	.wait('#HoldingsUSD')
	.evaluate(() => {
		let eth = document.querySelector('#HoldingsETH').innerHTML;
		let usd = document.querySelector('#HoldingsUSD').innerHTML;
		return {eth: parseFloat(eth.replace(/,/g, '')), usd: parseFloat(usd.replace(/[,$]/g, ''))};
	})
	.end()
	.then((res)=>{
		return res;
	})
	.catch(error => {
		console.error('Search failed:', error)
		throw error;
	})
}

async function getBalance(addr, type) {
	if (type == 'BTC') {
		return rp.get({
			uri:'https://blockchain.info/balance?active='+addr,
			json: true
		}).then(function (res) {
			return parseFloat(res[addr].final_balance) / Math.pow(10, 8);
		});
	} else if (type == 'ETH') {
		return rp.get({
			uri: 'https://api.etherscan.io/api?module=account&action=balance&address=' + addr + '&tag=latest',
			json: true
		}).then(function (res) {
			return parseFloat(res.result) / Math.pow(10, 18);
		});
		
	} else if (type == 'USDT') {
		return rp.post({
			uri: 'https://api.omniwallet.org/v2/address/addr/',
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			form: {
				addr: addr
			}
		}).then(function (res) {
			try {
				let d = JSON.parse(res);
				let balance = 0;
				d[addr].balance.map(item => {
					if (item.symbol == 'SP31') {
						balance = parseFloat(item.value)/Math.pow(10, 8);
					}
				})
				return balance;
		 	} catch(e) { throw e; }
		});
		
	}
}

async function getData() {
	await wait(1000);
	console.log('Scraper Start ' + new Date().getTime());
	let finalData = Object.assign({}, addresses);
	
	await Promise.all([
		binanceEx.loadMarkets(),
		bitfinexEx.loadMarkets(),
		coinbaseEx.loadMarkets(),
		bitstampEx.loadMarkets(),
	]);
	// for(let ex in finalData.bitcoin) {
	// 	for (let index = 0; index < finalData.bitcoin[ex].length; index ++) {
	// 		let b = await getBalance(finalData.bitcoin[ex][index].address, 'BTC');
	// 		await wait(1000);
	// 		finalData.bitcoin[ex][index].balance = b;
	// 	}
	// }

	// for(let ex in finalData.ethereum) {
	// 	for (let index = 0; index < finalData.ethereum[ex].length; index ++) {
	// 		let b = await getBalance(finalData.ethereum[ex][index].address, 'ETH');
	// 		console.log(b);
	// 		await wait(1000);
	// 		finalData.ethereum[ex][index].balance = b;
	// 	}
	// }

	// for(let ex in finalData.tether) {
	// 	for (let index = 0; index < finalData.tether[ex].length; index ++) {
	// 		let b = await getBalance(finalData.tether[ex][index].address, 'USDT');
	// 		console.log(b);
	// 		await wait(1000);
	// 		finalData.tether[ex][index].balance = b;
	// 	}
	// }

	for(let ex in finalData.ethereum) {
		for (let index = 0; index < finalData.ethereum[ex].length; index ++) {
			let b = await getERC20Balance(finalData.ethereum[ex][index].address);
			await wait(1000);
			console.log(b);
			finalData.ethereum[ex][index].erc20 = b;
		}
	}

	let rates = await Promise.all([
		binanceEx.fetchTicker ('BTC/USDT'),
		binanceEx.fetchTicker ('ETH/BTC'),
	]);;
	finalData.rates = rates;


    let prices = await Promise.all([
		binanceEx.fetchTicker ('BTC/USDT'),
		bitfinexEx.fetchTicker ('BTC/USDT'),
		coinbaseEx.fetchTicker ('BTC/USD'),
		bitstampEx.fetchTicker ('BTC/USD'),
		binanceEx.fetchTicker ('ETH/USDT'),
		bitfinexEx.fetchTicker ('ETH/USDT'),
		coinbaseEx.fetchTicker ('ETH/USD'),
		bitstampEx.fetchTicker ('ETH/USD'),
    ]);
    finalData.priceTable = {
		binance: {
			BTC: prices[0].ask,
			ETH: prices[4].ask,
		},
		bitfinex: {
			BTC: prices[1].ask,
			ETH: prices[5].ask,
		},
		coinbase: {
			BTC: prices[2].ask,
			ETH: prices[6].ask,
		},
		bitstamp: {
			BTC: prices[3].ask,
			ETH: prices[7].ask,
		},
    }
    
	let outTether = await getOutTether();
	finalData.outTether = outTether;
	finalData.timestamp = new Date();

	saveData(finalData);

	console.log('Scraper End ' + new Date().getTime());
}
(async()=>{
	await getData();
})();


var cron = require('node-cron');

cron.schedule('0 0 */4 * * *', () => {
  console.log('running a task every 4 hr');
  getData();
});