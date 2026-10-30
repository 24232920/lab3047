<script setup>
import { ref, onMounted, defineProps } from "vue";
import {apiRequest} from "../services/api";

const props = defineProps({
    team: String,
});

const options = ref({});
const series = ref([]);

onMounted(async () => {
    const json = await apiRequest(`/api/bookings/stats/superhero?team=${props.team}`);    
    options.value = {
        labels: json.map((item) => item._id),
        title: { text: props.team || "All Teams" }
    };
    series.value = json.map((item) => item.total);
});

</script>

<template>
    <div>
        <apexchart type="donut" :options="options" :series="series" />
    </div>
</template>