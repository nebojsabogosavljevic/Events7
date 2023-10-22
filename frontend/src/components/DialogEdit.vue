<template>
    <v-dialog
        max-width="500px"
    >
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Event</span>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="editingEvent.name"
                    label="Name"
                    required
                ></v-text-field>
                <v-textarea
                    v-model="editingEvent.description"
                    label="Description"
                    required
                ></v-textarea>
                <v-select
                    v-model="editingEvent.type"
                    :items="eventTypes"
                    label="Type"
                    required
                ></v-select>
                <v-row>
                    <v-col>
                        <v-slider
                        v-model="editingEvent.priority"
                        label="Priority (0-10)"
                        min="0"
                        max="10"
                        step="1"
                        thumb-label
                        ></v-slider>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        v-model="editingEvent.priority"
                        label="Priority (0-10)"
                        type="number"
                        min="0"
                        max="10"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="saveEdit"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DialogEdit',
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },
        item: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        editingEvent: {},
        eventTypes: ["crosspromo", "app", "game", "other"],
    }),
    watch: {
        item: {
            handler() {
                this.editingEvent = Object.assign({}, this.item);
            },
            deep: true,
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        saveEdit() {
            this.$emit('save-edit', this.editingEvent);
        },
    },
};
</script>

<style>
.v-card-title {
    text-align: center;
}
</style>