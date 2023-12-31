<template>
    <v-container class="dashboard-container">
        <v-app>
            <v-card>
                <v-card-title class="headline">
                    Events7 Dashboard
                </v-card-title>
                <v-form @submit.prevent="createEvent">
                    <v-card-text>
                        <v-text-field
                            v-model="newEvent.name"
                            label="Name"
                            required
                        ></v-text-field>
                        <v-textarea
                            v-model="newEvent.description"
                            label="Description"
                            required
                        ></v-textarea>
                        <v-select
                            v-model="newEvent.type"
                            :items="eventTypes"
                            label="Type"
                            required
                        ></v-select>
                        <v-row>
                            <v-col>
                                <v-slider
                                v-model="newEvent.priority"
                                label="Priority (0-10)"
                                min="0"
                                max="10"
                                step="1"
                                thumb-label
                                ></v-slider>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field
                                v-model="newEvent.priority"
                                label="Priority (0-10)"
                                type="number"
                                min="0"
                                max="10"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="center-btn">
                        <v-btn append-icon="mdi-check-circle" type="submit" variant="outlined" color="success">Create Event</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-app>
        <EventsTable :headers="headers" :events="events" @editEvent="editEvent" @deleteEvent="deleteSingleEvent" @deleteSelectedEvents="deleteSelected" />
    </v-container>

    <DialogDelete v-model="dialogDelete" :item="editingEvent" @closeDelete="closeDelete" @deleteItemConfirm="deleteItemConfirm" />
    <DialogEdit v-model="dialog" :item="editingEvent" @close="close" @save-edit="saveEdit" />
    <SnackBarMessage v-model="snackbar" :message="message" :color="snackbarColor" @hideMe="hideSnackbarMsg" />
</template>
  
<script>
import SnackBarMessage from '@/components/SnackBarMessage.vue';
import DialogDelete from '@/components/DialogDelete.vue';
import DialogEdit from '@/components/DialogEdit.vue';
import EventsTable from '@/components/EventsTable.vue';
import { createEvent, getEvents, updateEvent, deleteEvent, deleteSelectedEvents } from '@/middleware/events.middleware';

export default {
    components: {
        SnackBarMessage,
        DialogDelete,
        DialogEdit,
        EventsTable,
    },
    data() {
      return {
        newEvent: {
          name: "",
          description: "",
          type: "crosspromo",
          priority: 0,
        },
        dialog: false,
        dialogDelete: false,
        eventTypes: ["crosspromo", "app", "game", "other"],
        events: [],
        editingEvent: null,
        headers: [
            { title: 'ID', value: '_id', key: '_id' },
            { title: 'Name', value: 'name', key: 'name' },
            { title: 'Description', value: 'description', key: 'description' },
            { title: 'Type', value: 'type', key: 'type' },
            { title: 'Priority', value: 'priority', key: 'priority' },
            { title: 'Actions', value: 'actions', key: 'actions', sortable: false },
            ],
        snackbar: false, 
        message: '',
        snackbarColor: 'success'
      };
    },
    async mounted() {
      this.events = await getEvents();
      console.log(this.events);
    },
    methods: {
    async createEvent() {
        if (!this.newEvent.name) {
            this.showMessage('Please enter a name for the event.', 'error');
            return;
        } else if (!this.newEvent.description) {
            this.showMessage('Please enter a description for the event.', 'error');
            return;
        }

        const createdEvent = await createEvent({
            data: this.newEvent,
        });
        this.events.push({ ...createdEvent });
        this.clearForm();

        this.showMessage('Event created successfully.', 'success');
    },
    editEvent(event) {
      this.editingEvent = { ...event };
      this.dialog = true;
    },
    async saveEdit (editedItem) {
        this.editingEvent = editedItem;
        try {
            const index = this.events.findIndex((event) => event._id === this.editingEvent._id);
            if (index > -1) {
              const updateResult = await updateEvent(this.editingEvent._id, this.editingEvent);
              if (!updateResult.status) {
                this.showMessage('Error updating event.', 'error');
                return;
              }
              Object.assign(this.events[index], this.editingEvent)
              this.showMessage('Event updated successfully.', 'success');
            } else {
                const createEvent = await createEvent({
                  data: {
                      name: this.editingEvent.name,
                      description: this.editingEvent.description,
                      type: this.editingEvent.type,
                      priority: this.editingEvent.priority,
                  },
                });
                this.events.push(this.editingEvent)
                this.showMessage('Event created successfully.', 'success');
            }
            this.close()
        } catch (error) {
            this.showMessage('Error updating event.', 'error');
        }
      },
    deleteSingleEvent(event) {
        this.dialogDelete = true;
        this.editingEvent = { ...event };
    },
    async deleteItemConfirm () {
      console.log(this.editingEvent)
        const index = this.events.findIndex((e) => e._id === this.editingEvent._id);
        if (index > -1) {
            await deleteEvent(this.editingEvent._id);
            this.events.splice(index, 1);
            this.showMessage('Event deleted successfully.', 'success');
        } else {
            this.showMessage('Event not found.', 'error');
        }
        this.closeDelete()
    },
    async deleteSelected(selectedEvents) {
      if (selectedEvents.length === 0) {
        this.showMessage('Please select at least one event to delete.', 'error');
        return;
      }
      const delSelectedResult = await deleteSelectedEvents(selectedEvents);
      selectedEvents.forEach((id) => {
        const index = this.events.findIndex((e) => e._id === id);
        if (index > -1) {
          this.events.splice(index, 1);
        }
      });
      if (!delSelectedResult.status) {
        this.showMessage('Error deleting events.', 'error');
        return;
      }
      this.showMessage('Events deleted successfully.', 'success');
    },
    closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
            this.editingEvent = Object.assign({}, this.defaultItem)
        })
    },
    clearForm() {
      this.newEvent = {
        id: null,
        name: "",
        description: "",
        type: "crosspromo",
        priority: 0,
      };
      this.editingEvent = null;
    },
    showMessage(msg, color) {
      this.message = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
    },
    hideSnackbarMsg() {
      this.snackbar = false;
    },
  },
  watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
};
</script>


<style>
.dashboard-container {
  max-width: 800px;
  /* max-height: 800px; */
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.v-application__wrap {
    max-height: none !important;
    min-height: 0px !important;
}

.dashboard-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.event-form {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
}

.event-form label {
  display: block;
  font-weight: bold;
  margin-top: 10px;
}

.event-form input, .event-form textarea {
  width: 95%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.event-form select {
  width: 98%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
  
.event-list {
  list-style: none;
  margin-top: 20px;
  padding: 20px 20px;
}

.event-item {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-button, .delete-button {
  background-color: #007bff;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.edit-button:hover, .delete-button:hover {
  background-color: #0056b3;
}

.event-header {
  display: flex;
  justify-content: space-between;
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
}

.header-item, .event-data {
  flex: 1;
  padding: 10px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.header-item:hover, .event-data:hover {
  white-space: normal;
  text-overflow: clip;
}

.event-data {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.create-button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.create-button:hover {
  background-color: #45a049;
}

.center-btn {
    display: flex;
    justify-content: center;
}
</style>