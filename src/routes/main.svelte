<script>
  import Connect from "./Connect.svelte";
  import sticker from "$lib/assets/sticker.jpg";
  import { goto } from "$app/navigation";

  function redirectTo() {
    goto("/orderform");
  }
</script>

<div class="container">
  <div class="row">
    <div class="col">
      <img
        src={sticker}
        alt="sticker"
        class="img-fluid"
        style="max-width: 100%;"
      />
    </div>
    <div class="col">
      <button type="button" class="btn btn-primary" on:click={redirectTo}
        >Order</button
      >
    </div>
  </div>
</div>
