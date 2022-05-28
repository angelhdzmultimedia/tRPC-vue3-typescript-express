<script setup lang="ts">
import { useTRPCClient } from './api';
import { ref, onMounted } from 'vue';

const user = ref({});

const { client } = useTRPCClient({
  url: 'http://localhost:4000/trpc',
});

interface Data {
  user: inferQueryOutput<'getUser'>;
}

async function getUser() {
  const index = await client.query('index');
  user.value = await client.query('getUser', +index);
}

onMounted(async () => {
  await getUser();
});

async function createUser() {
  user.value = await client.mutation('createUser', {
    name: 'Created from frontend request',
  });
  await getUser();
}
</script>

<template>
  <h1>Count: {{ user }}</h1>
  <button @click="createUser">Create New User</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
