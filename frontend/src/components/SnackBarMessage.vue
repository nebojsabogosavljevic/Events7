<template>
    <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        :color="color"
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
    name: 'SnackBarMessage',
    props: {
        message: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: 'success',
        },
    },
    data() {
        return {
        snackbar: false,
        };
    },
};
</script>