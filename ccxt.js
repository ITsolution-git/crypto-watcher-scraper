
const ccxt = require ('ccxt');
const moment = require('moment');
(async()=>{
	let binanceEx = new ccxt['binance']();
	let bitfinexEx = new ccxt['bitfinex']();
	let coinbaseEx = new ccxt['coinbase']();
	let bitstampEx = new ccxt['bitstamp']();

	await Promise.all([
		binanceEx.loadMarkets(),
		bitfinexEx.loadMarkets(),
		coinbaseEx.loadMarkets(),
		bitstampEx.loadMarkets(),
	]);

	let prices = await Promise.all([
		binanceEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
		bitfinexEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
		coinbaseEx.fetchOHLCV ('BTC/USD'),
		bitstampEx.fetchOHLCV ('BTC/USD', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
		binanceEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
		bitfinexEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
		coinbaseEx.fetchTicker ('ETH/USD'),
		bitstampEx.fetchOHLCV ('ETH/USD', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
	]);
	console.log(prices);
})();