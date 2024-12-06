<script>
  import { TelInput, normalizedCountries } from "svelte-tel-input";
  import "flag-icons/css/flag-icons.min.css";
  import { formData } from "$lib/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import  ordercute  from "$lib/assets/ordercute.jpg"
  
  let selected;

  let valid = true;

  let firstName = "", firstNameError = "";
  let lastName = "", lastNameError = "";
  let emailAddress = "", emailAddressError = "";
  let streetAddress = "", streetAddressError = "";
  let city = "", cityError = "";
  let zipCode = "", zipCodeError = "";
  let phoneNumber = "", phoneNumberError = "";
  let appSuite = "";
  let selectedState = "", stateError = "";

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  
// Load the current state of the form for editing.
onMount(() => {
  if (formData.firstName) {
    ({ firstName, lastName, emailAddress, streetAddress, city, 
      zipCode, appSuite, phoneNumber, selectedState, selected } = formData);
  }
});

  // Validation Functions// Validation Functions
  function validateFirstName() {
    firstNameError = firstName.trim() ? "" : "First Name is required.";
  }

  function validateLastName() {
    lastNameError = lastName.trim() ? "" : "Last Name is required.";
  }

  function validateEmailAddress() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailAddressError = emailRegex.test(emailAddress.trim())
      ? ""
      : "A valid email address is required.";
  }

  function validateStreetAddress() {
    streetAddressError = streetAddress.trim()
      ? ""
      : "Street Address is required.";
  }

  function validateCity() {
    cityError = city.trim() ? "" : "City is required.";
  }

  function validateZipCode() {
    zipCodeError =
      zipCode.trim().length > 2
        ? ""
        : "ZIP/Postal Code should be greater than 2 characters";
  }

  function validatePhoneNumber() {
    // TelInput returns null for binded value `phoneNumber` upon change.
    // Any null value returned will be consider as error.
    try {
      phoneNumberError =
        phoneNumber.trim() && valid ? "" : "Valid phone number is required.";
    } catch (e) {
      phoneNumberError = "Valid phone number is required.";
    }
  }

  const validateState = () => {
    if (!selectedState) {
      stateError = "State is required.";
    } else {
      stateError = "";
    }
  };

  const proceedToPayment = async () => {
      if (
        !firstNameError &&
        !lastNameError &&
        !emailAddressError &&
        !streetAddressError &&
        !cityError &&
        !zipCodeError &&
        !phoneNumberError
      ) {
        formData.firstName = firstName;
        formData.lastName = lastName;
        formData.emailAddress = emailAddress;
        formData.streetAddress = streetAddress;
        formData.city = city;
        formData.appSuite = appSuite;
        formData.zipCode = zipCode;
        formData.phoneNumber = phoneNumber;
        formData.selectedState = selectedState;
        formData.selected = selected;

        goto("/payment");
      }
    };

  const handleSubmit = async (event) => {
      event.preventDefault();

      validateFirstName();
      validateLastName();
      validateEmailAddress();
      validateStreetAddress();
      validateCity();
      validateZipCode();
      validatePhoneNumber();
      validateState();

      if (selected && selected.iso2 === "US") {
        if (!stateError) {
          proceedToPayment();
        } else {
          return;
        }
      } else {
        proceedToPayment();
      }
    }
</script>

<div class="container mt-4" style="max-width:600px">
  <p class="fs-5 my-3">
    *We need delivery information for shipping, all the information provided
    will be encrypted.
  </p>
  <h2 class="d-flex align-item-center">Contact and Delivery Address</h2>
  <form onsubmit={handleSubmit}>
    <!-- Country Selector and Phone Input -->
    <div class="row mb-4">
      <!-- Country and Flag -->
      <div class="col">
        <label for="countrySelect" class="form-label">Country</label>
        <div class="input-group">
          <!-- Flag Display -->
          <span class="input-group-text">
            {#if selected}
              <span
                class={`fi fi-${selected.iso2.toLowerCase()}`}
                style="font-size: 1.5rem;"
              ></span>
            {/if}
          </span>
          <!-- Country Dropdown -->
          <select id="countrySelect" class="form-select" bind:value={selected}>
            {#each normalizedCountries as country}
              <option value={country}>{country.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- State Selector (only if country is United States) -->
    {#if selected && selected.iso2 === "US"}
      <div class="row mb-4">
        <div class="col">
          <label for="stateSelect" class="form-label">State</label>
          <select
            id="stateSelect"
            class="form-select"
            bind:value={selectedState}
          >
            <option value="">Select State</option>
            {#each states as state}
              <option value={state}>{state}</option>
            {/each}
          </select>
          {#if stateError}
            <div class="text-danger">{stateError}</div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Personal Information -->
    <div class="row mb-4">
      <!-- First Name -->
      <div class="col-md-6">
        <label for="firstName" class="form-label">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          class={`form-control ${firstNameError ? "is-invalid" : ""}`}
          placeholder="First Name"
          bind:value={firstName}
          onblur={validateFirstName}
        />

        {#if firstNameError}
          <div class="text-danger">{firstNameError}</div>
        {/if}
      </div>

      <!-- Last Name -->
      <div class="col-md-6">
        <label for="lastName" class="form-label">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          class={`form-control ${lastNameError ? "is-invalid" : ""}`}
          placeholder="Last Name"
          bind:value={lastName}
          onblur={validateLastName}
        />
        {#if lastNameError}
          <div class="text-danger">{lastNameError}</div>
        {/if}
      </div>
    </div>

    <!-- Email Address -->
    <div class="row mb-4">
      <div class="col">
        <label for="email" class="form-label">Email Address</label>
        <input
          type="email"
          id="email"
          class={`form-control ${emailAddressError ? "is-invalid" : ""}`}
          placeholder="name@example.com"
          bind:value={emailAddress}
          onblur={validateEmailAddress}
        />
        {#if emailAddressError}
          <div class="text-danger">{emailAddressError}</div>
        {/if}
      </div>
    </div>

    <!-- Address Section -->
    <div class="row mb-4">
      <!-- Street Address -->
      <div class="col-md-8">
        <label for="streetAddress" class="form-label">Street Address</label>
        <input
          type="text"
          id="streetAddress"
          name="streetAddress"
          class={`form-control ${streetAddressError ? "is-invalid" : ""}`}
          placeholder="Street & number"
          bind:value={streetAddress}
          onblur={validateStreetAddress}
        />
        {#if streetAddressError}
          <div class="text-danger">{streetAddressError}</div>
        {/if}
      </div>

      <!-- App/Suite-->
      <div class="col-md-4">
        <label for="aptSuite" class="form-label">Apt/Suite (Optional)</label>
        <input
          type="text"
          id="aptSuite"
          name="aptSuite"
          class="form-control"
          bind:value={appSuite}
          placeholder="Apt/Suite"
        />
      </div>
    </div>

    <!-- City -->
    <div class="row mb-4">
      <div class="col-md-6">
        <label for="city" class="form-label">City</label>
        <input
          type="text"
          id="city"
          name="city"
          class={`form-control ${cityError ? "is-invalid" : ""}`}
          placeholder="City"
          bind:value={city}
          onblur={validateCity}
        />
        {#if cityError}
          <div class="text-danger">{cityError}</div>
        {/if}
      </div>

      <!-- ZIP/Postal Code -->
      <div class="col-md-6">
        <label for="zipCode" class="form-label">ZIP/Postal Code</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          class={`form-control ${zipCodeError ? "is-invalid" : ""}`}
          placeholder="ZIP/Postal Code"
          bind:value={zipCode}
          onblur={validateZipCode}
        />
        {#if zipCodeError}
          <div class="text-danger">{zipCodeError}</div>
        {/if}
      </div>
    </div>

    <!-- Phone Input-->
    <div class="row mb-4">
      {#if selected}
        <div class="col-md-6">
          <label for="phoneInput" class="form-label">Phone Number</label>
          <div class="input-group">
            <span class="input-group-text">+{selected.dialCode}</span>
            <TelInput
              bind:country={selected.iso2}
              bind:valid
              bind:value={phoneNumber}
              id="phoneInput"
              class={`form-control tel-input ${!valid || phoneNumberError ? "is-invalid" : ""}`}
              onblur={validatePhoneNumber}
            />
          </div>
          
          {#if phoneNumberError}
            <div class="text-danger">{phoneNumberError}</div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Submit Button -->
    <div class="text-center">
      <button type="submit" class="btn btn-primary">proceed to payment</button>
    </div>
  </form>
  
  <div class="d-flex justify-content-center">
    <div class="image-container sticker-image">
      <img src={ordercute} class="img-fluid" alt="order me">
    </div>
  </div>
</div>

<style>

.sticker-image {
    max-width: 15%;
  }
  

</style>
