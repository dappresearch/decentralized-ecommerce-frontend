<script>
  import onboard from "$lib/onboard.js";
  import { provider, networkError } from "$lib/stores.js";
  import { loadContract } from "$lib/helpers";

  let copied = false;

  const arbitrumChainId = "0xa4b1";

  // Subscribe to wallet updates
  const wallets$ = onboard.state.select("wallets");
  $: connectedAccount = $wallets$?.[0]?.accounts?.[0];

  $: account = connectedAccount?.ens?.name
    ? { ens: connectedAccount?.ens, address: connectedAccount?.address }
    : { address: connectedAccount?.address };

  $: provider.set($wallets$?.[0]?.provider);

  const requestNetworkSwitch = async () => {
  if (!$provider) return;
  try {
    await $provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: arbitrumChainId }],
    });
  } catch (error) {
    console.error("Error switching network:", error);
  }
  };

  // Check Chain ID and update error store
  const getChainId = async () => {
    if (!$provider) return;

    const chainId = await $wallets$?.[0]?.provider.request({
      method: "eth_chainId",
    });

    networkError.set(
      chainId !== arbitrumChainId ? "Please switch to Arbitrum Network." : "",
    );
  };

  $: if ($provider) getChainId();

  const connect = async () => {
    try {
      await onboard.connectWallet();
    } catch (error) {
      console.error("Error loading contract");
    }
  };

  const disconnect = ({ label }) => {
    $networkError = "";
    onboard.disconnectWallet({ label });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account.address);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };
</script>

{#if $provider}
  <button
    type="button"
    class="btn btn-light border border-success"
    on:click={copyToClipboard}
  >
    {account.address.slice(0, 6)}...{account.address.slice(-4)}

    {#if copied}
      <i class="bi bi-check2"></i>
    {:else}
      <i class="bi bi-clipboard"></i>
    {/if}
  </button>
  <button
    type="button"
    class="btn btn-danger ms-2"
    aria-label="Disconnect Wallet"
    on:click={disconnect($wallets$?.[0])}><i class="bi bi-power"></i></button
  >
{:else}
  <button type="button" class="btn btn-success" on:click={connect}
    >Connect Wallet</button
  >
{/if}
