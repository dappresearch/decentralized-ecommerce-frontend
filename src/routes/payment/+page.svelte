<script>
  import {
    formData,
    provider,
    quantity,
    orderNumber,
    nftLink,
    paymentSucess,
  } from "$lib/stores";
  import { goto } from "$app/navigation";
  import sticker from "$lib/assets/sticker.jpg";
  import OrderQuantity from "$lib/components/OrderQuantity.svelte";
  import onboard from "$lib/onboard.js";
  import { Web3 } from 'web3';

  import {
    loadContract,
    connectWallet,
    getCostAndPrice,
    loadPriceFeedV3,
    decryptForm,
    encryptForm,
  } from "$lib/helpers";

  $: buttonLabel = $provider ? "Pay With Ether" : "Connect Wallet To Pay";
  $: buttonColor = $provider ? "btn btn-primary" : "btn btn-success";

  let totalCost;
  let price;
  let totalStock;
  let data;

  let outOfStock = "Out Of Stock";

  let isDisable = false;

  // Show spinner while fetching data.
  let showSpinner = false;

  const fetchCostAndPrice = async (provider, qty) => {
    const data = await getCostAndPrice(provider, qty);
    if (data) {
      totalCost = data.totalCost;
      price = data.price;
      totalStock = data.totalStock;

      if (Number(totalStock) === 0) {
        isDisable = true;
        outOfStock = "Out of Stock";
      }
      
      showSpinner = false;
    }
  };

  $: if ($provider) {
    // Show spinner before fetching data.
    showSpinner = true;
    fetchCostAndPrice($provider, $quantity);
  }

  const redirectTo = async () => {
    goto("/orderform");
  };

  const payWithEther = async () => {

    if (!$provider) {
      await onboard.connectWallet();
      return;
    }

    isDisable = true;

    let stringData;

    try {
      const keys = Object.keys(formData);

      if (keys.length) {
        stringData = `${formData.firstName} ${formData.lastName} 
                         ${formData.emailAddress} ${formData.phoneNumber} ${formData.streetAddress}
                         ${formData.city} ${formData.zipCode} ${formData.appSuite}
                         ${formData.selectedState} ${formData.selected.name}`;
      } else {
        throw new Error("Invalid String Data.");
      }

      const { contract, defaultAccount } = await loadContract($provider);

      const publicKey = await contract.methods.publicKey().call();
      
      if (!publicKey) throw new Error("Invalid public key.");

      const stringEncrypted = await encryptForm(publicKey, stringData);

      // Calculate the total cost of the purchase (this should be done using the contract's totalCost function)
      const totalCost = await contract.methods.totalCost($quantity).call();

      // Send the transaction with some Wei
      const receipt = await contract.methods
        .purchase($quantity, stringEncrypted)
        .send({
          from: defaultAccount,
          value: totalCost, // Sending the calculated total cost in Wei
        });

      if (receipt.transactionHash) {
        console.log(receipt.transactionHash);

        const buyerTotalOrder = await contract.methods
          .getBuyersOrderLength(defaultAccount)
          .call();

        $orderNumber = buyerTotalOrder;

        $nftLink = await contract.methods.tokenURI($orderNumber).call();

        isDisable = false;

        paymentSucess.set(true);

        goto("/orders");
      }
    } catch (e) {
      console.log(e);
      isDisable = false;
    }
  };
</script>

{#if formData.firstName}
  <div class="container my-2" style="max-width:600px">
    <p class="fs-5 my-3">
      *We need delivery information for shipping, all the information provided
      will be encrypted.
    </p>
    <div class="row p-4 bg-light border rounded shadow-sm">
      <!-- Left Section: Contact Information -->
      <div class="col-md-6">
        <h6 class="fw-bold mb-3">Contact & Delivery</h6>
        <p class="mb-1">{formData.firstName} {formData.lastName}</p>
        <p class="mb-1">{formData.emailAddress}</p>
        <p class="mb-1">{formData.phoneNumber}</p>
      </div>

      <!-- Right Section: Delivery Address -->
      <div class="col-md-6">
        <h6 class="fw-bold mb-3">Delivery Address</h6>
        <p class="mb-1">{formData.streetAddress},</p>

        {#if formData.appSuite}
          <p class="mb-1">{formData.appSuite},</p>
        {/if}

        <p class="mb-1">{formData.city}, {formData.zipCode},</p>

        <p class="mb-1">{formData.selected.name},</p>

        {#if formData.selectedState}
          <p class="mb-1">{formData.selectedState}</p>
        {/if}
      </div>

      <!-- Edit Button -->
      <div class="col-12 text-start mt-3">
        <button
          class={`btn btn-primary rounded-pill px-4 ${isDisable ? "disabled" : ""}`}
          on:click={redirectTo}
        >
          Edit
        </button>
      </div>
    </div>

    <div class="row mt-4 p-4 bg-light border rounded shadow-sm">
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <img
          src={sticker}
          alt="sticker"
          class="img-fluid rounded shadow-sm sticker-image"
        />
      </div>
      
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <div class="text-center">
          <OrderQuantity />
          <div class="my-3 border-top pt-3">
            Total Price:
            {#if $provider}
              {#if showSpinner}
                <div
                  class="spinner-border spinner-border-sm"
                  role="status"
                ></div>
              {:else if Number(totalStock) === 0}
                <span class="text-danger">{outOfStock}</span>
              {:else if price && Number(totalStock) > 0}
                ${price}
              {/if}
            {:else}
              <button class="btn btn-light" on:click={connectWallet}>
                Connect Wallet
              </button>
            {/if}
            </div>
            
          <div class="my-3 border-top pt-3">
            Total Ether:
            {#if $provider}
              {#if showSpinner}
                <div
                  class="spinner-border spinner-border-sm"
                  role="status"
                ></div>
              {:else if Number(totalStock) === 0}
              <span class="text-danger">{outOfStock}</span>
              {:else if Number(totalCost) > 0}
                ${totalCost}
              {/if}
            {:else}
              <button class="btn btn-light" on:click={connectWallet}>
                Connect Wallet
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center my-4">
      <button
        type="button"
        class={`${buttonColor} rounded-pill px-4 ${isDisable ? "disabled" : ""}`}
        on:click={payWithEther}
      >
        {buttonLabel}
      </button>
    </div>

    <section>
      {#if isDisable && Number(totalStock) > 0}
        <div class="d-flex justify-content-center my-2">
          <div class="spinner-border spinner-border-sm" role="status"></div>
        </div>

        <div class="d-flex justify-content-center my-2">
          <p class="text-muted">Waiting for signature & receipt</p>
        </div>
      {/if}
    </section>
  </div>
{:else}
  <div class="container d-flex justify-content-center my-5">
    <p class="fs-1 text-center">
      Please fill up the <a
        class="link-primary text-decoration-none"
        href="/orderform">Order form</a
      >.
    </p>
  </div>
{/if}

<style>
  .sticker-image {
    max-width: 100%;
    height: auto;
  }
</style>
