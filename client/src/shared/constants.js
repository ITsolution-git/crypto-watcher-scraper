var protocol = location.protocol;
var slashes = protocol.concat("//");
var host = slashes.concat(location.hostname+':'+location.port);
export default {
  API_BASE_URL: host
}
	