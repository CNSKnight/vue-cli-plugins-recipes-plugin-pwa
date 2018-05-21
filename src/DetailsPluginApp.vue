<template>
    <div>
        <aside>
            <div class="row">
                <div class="col s12">
                    <app-notifications/>
                </div>
            </div>
        </aside>
        <main>
            <recipe-details-plugin/>
        </main>
    </div>
</template>

<script>
import Notifications from '@/components/notifications/Notifications';
import RecipeDetailsPlugin from '@/components/recipe-details/RecipeDetailsPlugin';
export default {
  name: 'details-plugin',
  components: {
    'app-notifications': Notifications,
    'recipe-details-plugin': RecipeDetailsPlugin
  }
};
</script>

<style src="@/assets/app.css"/>
