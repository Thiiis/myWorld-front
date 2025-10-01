<!-- <template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button @click="confirm">확인</button>
      <button @click="close">취소</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: ['isOpen', 'title', 'message', 'onConfirm', 'onClose'],
  setup(props) {
    const confirm = () => {
      props.onConfirm && props.onConfirm();
    };
    const close = () => {
      props.onClose && props.onClose();
    };
    return { confirm, close };
  }
};
</script>

<style>
.modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; }
.modal { background: #fff; padding: 20px; border-radius: 8px; width:300px; }
button { margin:5px; }
</style> -->
