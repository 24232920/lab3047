<script setup>
import { ref, onMounted, watch} from "vue";
 import { OTable, OTableColumn } from "@oruga-ui/oruga-next";
 import { apiRequest } from "../services/api.js";

const data = ref([]);
const total = ref(0);
const search = ref("");
const loading = ref(false);
const sortField = ref("vote_count");
const sortOrder = ref("desc");
const page = ref(1);
const perPage = ref(5);

const loadAsyncData = async function() {
    const params = [
        // "api_key=bb6f51bef07465653c3e553d6ab161a8",
        // "language=en-US",
        // "include_adult=false",
        // "include_video=false",
        `sort_by=${sortField.value}.${sortOrder.value}`,
        `page=${page.value}`,
        `email=${search.value}`,
    ].join("&");
    loading.value = true;

    try {
        const result = await apiRequest(`/api/bookings?${params}`);

        perPage.value = result.perPage;
        total.value = result.total;
        data.value = result.bookings

        loading.value = false;
    } catch (error) {
        data.value = [];
        total.value = 0;
        loading.value = false;
        alert(JSON.stringify(error));
    }
}

/*
 * Handle page-change event
 */
const onPageChange = function(p) {
    page.value = p;
    loadAsyncData();
}

/*
 * Handle sort event
 */
const onSort = function(column, order) {
    sortField.value = column?.field;
    sortOrder.value = order;
    loadAsyncData();
}

/*
 * Type style in relation to the value
 */
const type = function(value) {
    const number = parseFloat(value);
    if (number < 6) {
        return "is-danger";
    } else if (number >= 6 && number < 8) {
        return "is-warning";
    } else if (number >= 8) {
        return "is-success";
    } else return "";
}

onMounted(() => {
    loadAsyncData();
});

watch(() => search.value, () =>{
    loadAsyncData();
});

</script>

<template>
<section>
    <input class="form-control" v-model="search" placeholder="Search..." />
    <o-table
        :data="data"
        :loading="loading"
        paginated
        backend-pagination
        :total="total"
        :per-page="perPage"
        backend-sorting
        :default-sort="[sortField, sortOrder]"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        @page-change="onPageChange"
        @sort="onSort">
        <o-table-column
            v-slot="{ row }"
            field="email"
            label="Email"
            sortable>
            <RouterLink :to="`/booking/${row._id}`"> {{ row.email }} </RouterLink>
        </o-table-column>
        <o-table-column
            v-slot="{ row }"
            field="numTickets"
            label="NumTickets"
            numeric
            sortable>
            <span class="tag" :class="type(row.numTickets)">
                {{ row.numTickets }}
            </span>
        </o-table-column>
        <o-table-column
            v-slot="{ row }"
            field="superhero"
            label="Superhero"
            sortable>
            {{ row.superhero }}
        </o-table-column>
        <o-table-column
            v-slot="{ row }"
            field="created_at"
            label="Created At"
            sortable
            centered>
            {{
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : "unknown"
            }}
        </o-table-column>
        <o-table-column v-slot="{ row }" label="Payment" width="50">
            {{ row.payment }}
        </o-table-column>
    </o-table>
</section>

</template>