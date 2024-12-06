<script>
    import { loadContract, connectWallet, orderStatus } from "$lib/helpers";
    import { provider } from "$lib/stores";
    import Spinner from "$lib/components/Spinner.svelte";

    let orders = [];
    let currentAccount;
    let orderDetails = {};
    let orderNo;
    let loadingOrders = false;
    let loadingOrderDetails = false;

    let isDisable = false;

    // Show spinner while fetching data.
    let showSpinner = false;

    // show refund button
    let showRefundButton = true;

    $: showRefundButton; 

    const getOrders = async () => {
        loadingOrders = true;
        try {
            const { contract, defaultAccount } = await loadContract($provider);
            orders = await contract.methods.getOrder(defaultAccount).call();
            currentAccount = defaultAccount;
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            loadingOrders = false;
        }
    };

    // Fetch orders when provider is available
    $: if ($provider) {
        getOrders();
    }

    const handleOrderClick = async (order) => {
        loadingOrderDetails = true;
        try {
            const { contract, defaultAccount } = await loadContract($provider);
            orderNo = order;
            orderDetails = await contract.methods.getOrderDetails(order).call();
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            loadingOrderDetails = false;
        }
    };

    const handleConnectWallet = async () => {
        await connectWallet();
    };

    const collectRefund = async () => {
        try {
            const { contract } = await loadContract($provider);

            isDisable = true;

            // Show spinner while fetching data.
            showSpinner = true;

            const receipt = await contract.methods
                .collectRefund(orderNo)
                .send({ from: currentAccount });
                
            getOrders();

            if (receipt.transactionHash) {
                console.log(receipt.transactionHash);
                showRefundButton = false;
                isDisable = false;
                showSpinner = false;
            }

        } catch (error) {
            console.error("Error collecting refund:", error);
            isDisable = false;
            showSpinner = false;
        }
    };
</script>

<div class="container my-5" style="max-width:800px">
    <h2 class="mb-4">Orders</h2>
    {#if $provider}
        <section class="mb-5">
            {#if loadingOrders}
                <Spinner />
            {:else}
                <div class="d-flex flex-wrap gap-2">
                    {#each orders as order}
                        <button
                            class="btn btn-outline-primary btn-lg"
                            on:click={() => handleOrderClick(order)}
                        >
                            Order #{order}
                        </button>
                    {/each}
                </div>
            {/if}
        </section>

        <section>
            <h2 class="mb-4">Order Details</h2>
            {#if loadingOrderDetails}
                <Spinner />
            {:else if orderDetails.shippingAddr}
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order #{orderNo}</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <strong>Quantity:</strong>
                                {orderDetails.quantity}
                            </li>
                            <li class="list-group-item">
                                <strong>Amount:</strong>
                                {orderDetails.amount}
                            </li>
                            <li class="list-group-item">
                                <strong>Buyer Address:</strong>
                                {orderDetails.buyerAddr}
                            </li>
                            <li class="list-group-item">
                                <strong>Shipping Address:(encrypted)</strong>
                                {orderDetails.shippingAddr}
                            </li>
                            <li class="list-group-item">
                                <strong>Order Status:</strong>
                                {orderStatus(Number(orderDetails.status))}
                            </li>
                        </ul>

                        {#if Number(orderDetails.status) === 3 && showRefundButton}
                            <div class="d-flex justify-content-center">
                                <button
                                class={`btn btn-success btn-sm ${isDisable ? "disabled" : ""}`}
                                on:click={collectRefund}
                                >Collect Refund</button
                            >
                            </div>
                        {/if}

                        {#if isDisable}
                        <div class="d-flex justify-content-center my-2">
                            <div class="spinner-border spinner-border-sm" role="status"></div>
                          </div>
                  
                          <div class="d-flex justify-content-center my-2">
                            <p class="text-muted">Waiting for signature & receipt</p>
                          </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <p class="text-muted">
                    No order selected. Click on an order to view details.
                </p>
            {/if}
        </section>
    {:else}
        <div>
            <button
                class="btn btn-success btn-sm"
                on:click={handleConnectWallet}>Connect Wallet</button
            >
            <h2 class="my-5">Order Details</h2>
            <div class="card my-4">
                <div class="card-body">Connect wallet to view your orders.</div>
            </div>
        </div>
    {/if}
</div>

<style>
    .card {
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .list-group-item {
        border: none;
    }
</style>
