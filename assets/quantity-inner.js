// Function to handle quantity increment and decrement
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const minusButton = document.querySelector('.js_minus');
    const plusButton = document.querySelector('.js_plus');
    const quantityInput = document.querySelector('.js_qty');

    // Parse the minimum value from the input attribute
    let minQuantity = parseInt(quantityInput.getAttribute('data-min')) || 1;
    let step = parseInt(quantityInput.getAttribute('data-step')) || 1;

    // Function to update the quantity
    function updateQuantity(amount) {
        let currentQuantity = parseInt(quantityInput.value);
        let newQuantity = currentQuantity + amount;

        // Ensure new quantity is not less than the minimum quantity
        if (newQuantity < minQuantity) {
            newQuantity = minQuantity;
        }

        quantityInput.value = newQuantity;
    }

    // Event listener for minus button
    minusButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        updateQuantity(-step); // Decrease the quantity
    });

    // Event listener for plus button
    plusButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        updateQuantity(step); // Increase the quantity
    });
});
