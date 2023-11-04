import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import logo from '@/assets/logo.png';
import router from './router';
import store from './store';
import directive from './directive';
// import './mock';
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/utils/interceptor';
import { formatTime, parseTime } from './utils/time';
import { densityList, genderList } from './utils/consts';
import { hasPermission } from './utils/permission';

const app = createApp(App);

app.config.globalProperties.$formatUrl = (url: string) => {
  return `/${url}`;
};
app.config.globalProperties.$logo = logo;
app.config.globalProperties.$formatTime = formatTime;
app.config.globalProperties.$parseTime = parseTime;
app.config.globalProperties.$densityList = densityList;
app.config.globalProperties.$genderList = genderList;
app.config.globalProperties.$hasPermission = hasPermission;

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
