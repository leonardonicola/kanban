<template>
  <section class="w-full overflow-hidden">
    <FormTasks />
    <FormBoard />
    <HeaderComponent />
    <div
      class="grid grid-flow-col gap-10 p-5 overflow-x-auto h-[calc(100vh-100px)]"
    >
      <Columns />
      <FormColumn />
    </div>
  </section>
</template>
