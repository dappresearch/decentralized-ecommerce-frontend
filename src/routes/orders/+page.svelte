<script>
  import { orderNumber, nftLink, paymentSucess } from "$lib/stores";
  import { onMount } from "svelte";

  let imageUrl = "";

  onMount(async () => {
    if ($nftLink) {
      try {
        const response = await fetch($nftLink);
        const data = await response.json();
        imageUrl = data.image; 
      } catch (error) {
        console.error("Error fetching or parsing JSON:", error);
      }
    }
  });
</script>

<div class="d-flex justify-content-center py-5">
  <div
    class="card shadow-lg border-0"
    style="max-width: 500px; border-radius: 1rem; overflow: hidden;"
  >
    <div class="card-header bg-light text-black text-center py-4">
      {#if $paymentSucess}
        <h3 class="mb-0">Your order is being processed</h3>
        <p class="mt-2">
          We are currently preparing your order. You’ll receive a confirmation
          soon. Thank you for your patience!
        </p>
      {:else}
        <h3 class="mb-0">No order found</h3>
      {/if}
    </div>
    <div class="card-body text-center px-4 py-5">
      {#if $paymentSucess}
        <h5 class="card-title mb-4">
          Order Number: <span class="text-black">{$orderNumber}</span>
        </h5>
        {#if imageUrl}
          <p class="card-text mb-3">Minted new nft as a proof of purchase.</p>
          <img
            src={imageUrl}
            alt=""
            class="img-fluid rounded shadow-sm mb-4"
            style="max-width: 80%; border: 1px solid #dee2e6;"
          />
        {/if}
      {/if}
      <a href="/" class="btn btn-primary btn-lg px-4">Go to Homepage</a>
    </div>
  </div>
</div>

<style>
  @media (max-width: 768px) {
    .card {
      margin: 0 15px;
    }
  }
</style>