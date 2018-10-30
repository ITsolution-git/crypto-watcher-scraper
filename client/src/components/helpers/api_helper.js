import ApiWrapper from '@/shared/utils/ApiWrapper';
// import { api } from "../../config.json";
import auth from "../../auth.js";

export function get(path) {
  return ApiWrapper.get(path, {
    headers: auth.getHeaders()
  });
}

export function post(path, params = {}) {
  return ApiWrapper.post(path, params, {
    headers: auth.getHeaders()
  });
}

export function put(path, params = {}) {
  return ApiWrapper.put(path, params, {
    headers: auth.getHeaders()
  });
}

export function deleteRequest(path) {
  return ApiWrapper.delete(path, {
    headers: auth.getHeaders()
  });
}
