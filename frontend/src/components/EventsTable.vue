<template>
    <v-card class="event-list">
        <v-card-title class="headline">
            <v-row no-gutters>
                <v-col class="text-end" cols="7"> 
                    Event List
                </v-col>
                <v-col class="text-end">
                    <v-btn
                        @click="deleteSelectedEvents"
                        color="error"
                        :disabled="selectedItems.length === 0"
                    >
                        Delete Selected
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="events"
            item-key="id"
            class="elevation-1"
            item-selectable="selectable"
            show-select
            v-model="selectedItems"
            >
            <template v-slot:items="props">
                <tr>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td class="event-description">{{ props.item.description }}</td>
                    <td>{{ props.item.type }}</td>
                    <td>{{ props.item.priority }}</td>
                </tr>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                    size="small"
                    class="me-2"
                    @click="editEvent(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    size="small"
                    @click="deleteEvent(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>

export default {
    name: 'EventsTable',
    props: {
        headers: {
            type: Array,
            default: () => [],
        },
        events: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        selectedItems: [],
    }),
    methods: {
        editEvent(event) {
            this.$emit('edit-event', event);
        },
        deleteEvent(event) {
            this.$emit('delete-event', event);
        },
        deleteSelectedEvents() {
            this.$emit('delete-selected-events', this.selectedItems);
        },
    },
};
</script>