<template>
  <div class="details">
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
          <app-notifications />
        </div>
      </div>
    </aside>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Notifications from '@/components/notifications/Notifications';
export default {
  name: 'App',
  components: {
    'app-notifications': Notifications
  }
};
</script>

<style lang="scss" src="@/assets/app.scss" />
<style lang="scss" src="@/assets/details-plugin.scss" />
