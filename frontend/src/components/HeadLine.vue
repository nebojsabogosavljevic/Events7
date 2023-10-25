<template>
    <v-card class="headline-card">
        <v-card-title class="headline-title">
            <slot>Events App</slot>
        </v-card-title>
    </v-card>
</template>
  
<script>
    export default {
        name: 'HeadLine',
    };
</script>
  
<style scoped>
.headline-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 100;
    margin: 0px 0px 40px 0px;
}

.headline-title {
    font-size: 24px;
    padding: 20px 0px;
}
</style>