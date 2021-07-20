import { defineAsyncComponent } from 'vue';
import { createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
// import Hello from '@/components/Hello'
import Recipes from '@/components/recipes/Recipes';
import RecipeDetailsPlugin from '@/components/recipe-details/RecipeDetailsPlugin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: defineAsyncComponent({
      loader: () => import('../views/About.vue')
    })
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/recipe-details',
    name: 'Details',
    component: RecipeDetailsPlugin
  }
];

const router = createRouter({
  routes
});

export default router;
