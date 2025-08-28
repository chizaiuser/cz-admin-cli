import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
// 创建 axios 实例
const service = axios.create({
  baseURL: '/admin', // 根据实际情况配置
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleNoToken = () => {
    ElMessage.warning('未查询到登录信息，请登录！');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
};
service.interceptors.request.use(config => {
    // const navigate = useNavigate();
    const token = localStorage.getItem('token')
    if (!["/oauth2/token", '/user/checkUserExpired'].some(item => config.url && config.url.includes(item))) { // 跳过对登录接口与权限验证接口的拦截
        if (token) { // 无权限token跳转至登录页
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            ElMessage.warning('未查询到登录信息，请登录！');
            handleNoToken();
            // setTimeout(() => {
            //     navigate('/login')
            // }, 1000)
        }
    }
    return config
}, error => {
    if (error.response?.status === 424) {
        // const navigate = useNavigate();
        ElMessage.warning('登录信息已过期，请重新登录！');
        // setTimeout(() => {
        //     navigate('/login')
        // }, 1000)
        handleNoToken();
    }
    return Promise.reject(error)
});

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 只处理业务code
    if (response.data && response.data.code === 0) {
      return Promise.resolve(response.data);
    } else {
    console.log(response.data, '获取token过期的信息') 
    // 业务错误
      return Promise.reject(response.data);
    }
    
  },
  (error) => {
    if (error.response.data.code === 1 && error.response.data.msg === '请求令牌已过期') {
        ElMessage.warning('登录信息已过期，请重新登录！');
        handleNoToken();
    }else {
        // 网络/服务器错误
        return Promise.reject({
            code: -1,
            msg: error.message || '网络异常',
            ...error.response?.data,
        });
    }
    console.log(error, '获取token过期的信息') 
    
  }
);

// 通用请求方法
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>;
}

export default service;