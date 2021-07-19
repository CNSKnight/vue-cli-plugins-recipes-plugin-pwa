import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
// import Hello from '@/components/Hello'
import Recipes from '@/components/recipes/Recipes';
import RecipeDetailsPlugin from '@/components/recipe-details/RecipeDetailsPlugin.vue';

Vue.use(Router);

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
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
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
  ]
});

const router = new Router({
  routes
});

export default router;
