<script setup>
import { ref, onMounted } from "vue";
import {apiRequest} from "../services/api";

const options = ref({});
const series = ref([]);

onMounted(async () => {
    var json = await apiRequest("/api/bookings/stats/superhero");
    options.value = { labels: json.map((item) => item._id) };
    series.value = json.map((item) => item.total);
});

</script>

<template>
    <div>
        <apexchart type="donut" :options="options" :series="series" />
    </div>
</template>