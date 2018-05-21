<template>
  <div id="app">
    <header>
      <nav class="lime darken-2 mb-lg">
        <div class="nav-wrapper">
          <ul>
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/recipes">Recipes</router-link>
            </li>
            <li>
              <router-link to="/recipe-details">Details</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <aside>
      <div class="row">
        <div class="col s12">
          <app-notifications/>
        </div>
      </div>
    </aside>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import Notifications from '@/components/notifications/Notifications';
export default {
  name: 'app',
  components: {
    'app-notifications': Notifications
  }
};
</script>

<style src="@/assets/app.css"/>
