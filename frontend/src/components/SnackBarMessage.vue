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
          @click="hideMe"
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
    methods: {
        hideMe() {
            this.$emit('hide-me');
        },
    },
};
</script>