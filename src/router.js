import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Post from "./views/Post.vue";
import CreatePost from "./views/CreatePost.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/post/:slug", component: Post },
    { path: "/create", component: CreatePost },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
