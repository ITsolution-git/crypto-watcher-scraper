let url;
if (window.location.hostname.indexOf('localhost') != -1)
	url = 'http://localhost:3000'
if (window.location.hostname.indexOf('18.222.107.103') != -1)
	url = 'http://18.222.107.103:3000'
if (window.location.hostname.indexOf('18.191.231.106') != -1)
	url = 'http://18.191.231.106:3000'
export default {
  API_BASE_URL: url
}
