import axios from 'axios'

const API_URL = (process.env.NODE_ENV === 'production') ? '/api' : 'http://localhost:3000/api';

const Api = {
  axiosConfig: {
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  },

  init(){
    this.plain = axios.create(this.axiosConfig);
    this.secured = axios.create(this.axiosConfig);
    
    this.mountRequestInterceptors();
    this.mountResponseInterceptors();
  },

  mountRequestInterceptors(){
    this.secured.interceptors.request.use(config => {
      const method = config.method.toUpperCase()
      if (method !== 'OPTIONS' && method !== 'GET') {
        config.headers = {
          ...config.headers,
          'X-CSRF-TOKEN': localStorage.csrf
        }
      }
      return config;
    });
  },

  mountResponseInterceptors(){
    this.secured.interceptors.response.use(null, error => {
      if (error.response && error.response.config && error.response.status === 401) {
        // If 401 by expired access cookie, we do a refresh request
        return this.plain.post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': localStorage.csrf } })
          .then(response => {
            localStorage.csrf = response.data.csrf
            localStorage.signedIn = true
            // After another successfull refresh - repeat original request
            let retryConfig = error.response.config
            retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
            return this.plain.request(retryConfig)
          }).catch(error => {
            delete localStorage.csrf
            delete localStorage.signedIn

            return Promise.reject(error)
          })
      } else {
        return Promise.reject(error)
      }
    });
  }
};

Api.init();

export default Api;