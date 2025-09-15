import axios from 'axios';

let production = true; //

export let baseUrl;
export let imageUrl;
export let profileImg;

if (production) {
  baseUrl = 'https://api.themewashoppe.in/api/';
  imageUrl = `https://www.themewashoppe.in`;
  profileImg = `https://api.themewashoppe.in`;
} else {
  baseUrl = 'https://api-tms.goldenbuzz.in/api/';
  imageUrl = `https://tms.goldenbuzz.in`;
  profileImg = `https://api-tms.goldenbuzz.in/`;
}

// https://api-tms.goldenbuzz.in/api/Home/CategoryGet

// export const serverUrl = "production";  //for live
// export const serverUrl = 'dev'; // for staging

// if (serverUrl === 'production') {
//   baseUrl = 'http://localhost:51181/BookingMaster/';
// } else {
//   baseUrl = 'https://api-tms.goldenbuzz.in/api/';
// }

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

export default axiosInstance;
