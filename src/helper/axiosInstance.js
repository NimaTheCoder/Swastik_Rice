import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://api-pragya.goldenbuzz.in',
// });
// export default axiosInstance;

import {baseUrl} from '../../config';

axios.interceptors.request.use(config => {
  config.baseURL = baseUrl;

  // const token = localStorage.getItem("_t");

  // if (token) {
  //   config.headers = {
  //     Authorization: `Bearer ${token}`,
  //   };
  // } else {
  //   axios.defaults.headers.common.Authorization &&
  //     delete axios.defaults.headers.common.Authorization;
  //   config.headers = axios.defaults.headers;
  // }
  return config;
});

axios.interceptors.response.use(null, error => {
  // const expectedError = error.response.status > 400;
  // console.log('expectedError', expectedError);
  // // const expectedError =
  // // error.response &&
  // // error.response === 401 &&
  // // error.response.status >= 400 &&
  // // error.response.status < 500;

  // if (!expectedError) {
  //   // console.log("expectedError", expectedError);
  //   // console.log("Error****", error);
  //   // console.log("Error****401", error?.response?.status);
  //   // defaultLogOut();
  //   // setTimeout(() => {
  //   //   window.location.href = "/login";
  //   // }, 500);
  // }

  return Promise.reject(error?.response?.data?.Message);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};
