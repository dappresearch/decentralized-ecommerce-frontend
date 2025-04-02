<script>
  import Connect from "./Connect.svelte";
 
  import OrderQuantity from "$lib/components/OrderQuantity.svelte";
  import { provider } from "$lib/stores.js";
  import { goto } from "$app/navigation";
  import { connectWallet, getCostAndPrice } from "$lib/helpers";

  let totalCost;
  let price;
  let totalStock;
  let data;
  let showSpinner = false
  let isDisable = false;

  let productImage = import.meta.env.VITE_PRODUCT_IMAGE;

  const fetchCostAndPrice = async (provider, qty) => {
    const data = await getCostAndPrice(provider, qty);
    if (data) {
      totalCost = data.totalCost;
      price = data.price;
      totalStock = data.totalStock;
      
      if(Number(totalStock) === 0) {
        isDisable = true;
      }
      showSpinner = false;
    }
  };

  $: if ($provider) {
    showSpinner = true;
    fetchCostAndPrice($provider, 1);
  }

  function redirectTo() {
    goto("/orderform");
  }
</script>

<div class="container">
  <div class="row">
    <div class="col-md-6 text-center">
      <img
        src={productImage}
        alt="sticker"
        class="img-fluid sticker-image"
      />
    </div>
    <div class="col-md-6 d-flex flex-column mt-2">
      <div>
        <h4>Lasha Apso Dog Sticker - 1 Sheet</h4>
        <p class="fs-6">*Shipping price included</p>
        <h5>
          Price:
          {#if $provider && showSpinner}
            <div class="spinner-border spinner-border-sm" role="status"></div>
          {:else if $provider && price}
            ${price} per piece
          {:else}
            <button class="btn btn-light" on:click={connectWallet}
              >connect wallet</button
            > to get price.
          {/if}
        </h5>
      </div>
      <div>
        <h5>
          Ether Amount:
          {#if $provider && showSpinner}
            <div class="spinner-border spinner-border-sm" role="status"></div>
          {:else if $provider && totalCost}
            {totalCost}
          {:else}
            <button class="btn btn-light" on:click={connectWallet}
              >connect wallet</button
            >
          {/if}
        </h5>
        <h5>
          Available:
          {#if $provider}
            {#if showSpinner}
              <div class="spinner-border spinner-border-sm" role="status"></div>
            {:else if totalStock}
              {totalStock}
            {:else if Number(totalStock) === 0}
              <span class="text-danger">Out of stock</span>
            {/if}
          {:else}
            <button class="btn btn-light" on:click={connectWallet}
              >connect wallet</button>
          {/if}
        </h5>
      </div>
      <div class="vstack align-items-center">
        <OrderQuantity />
        <button type="button" class={`btn btn-primary mt-3 ${isDisable ? "disabled" : ""}`} on:click={redirectTo}
          >Buy It Now</button
        >
      </div>
    </div>
  </div>
</div>
<style>

.sticker-image {
    max-width: 80%;
    height: auto;
  }

  @media (max-width: 768px) {
    .sticker-image {
      max-width: 30%;
    }
  }

</style>
