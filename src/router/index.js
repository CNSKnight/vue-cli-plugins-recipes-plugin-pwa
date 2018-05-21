import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
// import Hello from '@/components/Hello'
import Recipes from '@/components/recipes/Recipes';
import RecipeDetailsPlugin from '@/components/recipe-details/RecipeDetailsPlugin';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
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
