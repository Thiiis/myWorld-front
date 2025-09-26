<template>
  <div class="d-flex flex-column vh-100">
    <AppHeader />

    <div class="flex-grow-1 container-fluid"> <!--fluid는 꽉차게, 그냥넣으면 사이드에 빈 공간 생성-->
      <div class="row">
        <div>
          <AppMenu />
        </div>
        <div>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
  font-family: var(--text);
  background-color: #f9fafb;
}
</style>
