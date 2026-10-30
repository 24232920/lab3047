import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next';
import VueApexCharts from "vue3-apexcharts";

import { bootstrapConfig } from '@oruga-ui/theme-bootstrap';

import '@oruga-ui/theme-bootstrap/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"

const customConfig = {
    ...bootstrapConfig,
    iconPack: 'bootstrap',
    customIconPacks: {
        bootstrap: {
            iconPrefix: 'bi-',
        },
    },
    pagination: {
        ...bootstrapConfig.pagination,
        rootClass: 'pagination-wrapper d-flex align-items-center gap-1',
        listClass: 'pagination mb-0',
        buttonClass: 'btn',
        buttonPrevClass: 'pagination-prev d-inline-block',
        buttonNextClass: 'pagination-next d-inline-block',
    },
    table: {
        ...bootstrapConfig.table,
        iconPack: 'bootstrap',
    },
};

const app = createApp(App)

app.use(router).use(Oruga, customConfig).use(VueApexCharts)

app.mount('#app')
