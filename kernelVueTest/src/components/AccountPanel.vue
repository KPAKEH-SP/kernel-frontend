<script setup>
    import PrimaryButton from './ui/PrimaryButton.vue';

    const props = defineProps({
        username:{type:String, required:true}
    });

    const handleLogOut = () => {
        localStorage.removeItem("token");
        router.push({path: "/auth"});
    }
</script>


<template>
    <div>{{ props.username }}</div>
    <PrimaryButton @click="handleLogOut" text="log out" size="" color="red"/>
</template>