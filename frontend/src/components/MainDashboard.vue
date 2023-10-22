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
    <v-card class="event-list">
        <v-card-title class="headline">
          Event List
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="events"
            item-key="id"
            class="elevation-1"
            item-selectable="selectable"
            show-select
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

    <v-dialog
        v-model="dialog"
        max-width="500px"
    >
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editingEvent.name"
                            label="Dessert name"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editingEvent.description"
                            label="Calories"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editingEvent.type"
                            label="Fat (g)"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                            v-model="editingEvent.priority"
                            label="Carbs (g)"
                        ></v-text-field>
                    </v-col>
                </v-row>
              </v-container>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
    <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="snackbarColor"
        right
        bottom
    >
        {{ message }}
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          x
        </v-btn>
    </v-snackbar>
</template>
  
<script>
  export default {
    data() {
      return {
        newEvent: {
          id: null, // You can generate a unique ID when creating the event
          name: "",
          description: "",
          type: "crosspromo",
          priority: 0,
        },
        dialog: false,
        dialogDelete: false,
        eventTypes: ["crosspromo", "app", "game", "other"], // Array to store event types
        events: [
            {id: 21, name: "click-event", description: "when the user clicks the button the event should be triggered", type: "app", priority: 0 },
            {id: 22, name: "click-event-1", description: "when the user clicks the button the event should be triggered", type: "app", priority: 0 },
            {id: 20, name: "click-event-2", description: "when the user clicks the button the event should be triggered", type: "app", priority: 0 }
        ],
        editingEvent: null,
        headers: [
            { title: 'ID', value: 'id', key: 'id' },
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
    methods: {
    createEvent() {
        if (!this.newEvent.name) {
            this.showMessage('Please enter a name for the event.', 'error');
            return;
        }
        const uniqueId = Math.floor(Math.random() * 1000000);
        this.newEvent.id = uniqueId;
        this.events.push({ ...this.newEvent });
        this.clearForm();
        this.showMessage('Event created successfully.', 'success');
    },
    editEvent(event) {
      this.editingEvent = { ...event };
      this.dialog = true;
    },
    saveEdit () {
        try {
            const index = this.events.findIndex((event) => event.id === this.editingEvent.id);
            if (index > -1) {
                Object.assign(this.events[index], this.editingEvent)
            } else {
                this.events.push(this.editingEvent)
            }
            this.close()
            this.showMessage('Event updated successfully.', 'success');
        } catch (error) {
            this.showMessage('Error updating event.', 'error');
        }
      },
    deleteEvent(event) {
        this.dialogDelete = true;
        this.editingEvent = { ...event };
    },
    deleteItemConfirm () {
        const index = this.events.findIndex((e) => e.id === this.editingEvent.id);
        if (index > -1) {
            this.events.splice(index, 1);
            this.showMessage('Event deleted successfully.', 'success');
        } else {
            this.showMessage('Event not found.', 'error');
        }
        this.closeDelete()
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
  /* Remove ellipsis and display full text on hover */
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