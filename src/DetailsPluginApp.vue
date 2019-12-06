<template>
  <section class="details detailsPlugin">
    <aside class="row">
      <div class="col s12">
        <app-notifications />
      </div>
    </aside>
    <main>
      <recipe-details-plugin />
    </main>
  </section>
</template>

<script>
import Notifications from '@/components/notifications/Notifications';
import RecipeDetailsPlugin from '@/components/recipe-details/RecipeDetailsPlugin';
export default {
  name: 'details-plugin',
  components: {
    'app-notifications': Notifications,
    'recipe-details-plugin': RecipeDetailsPlugin,
  },
};
</script>

<style lang="scss" src="@/assets/app.scss" />
<style lang="scss" src="@/assets/details-plugin.scss" />
