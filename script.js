const cartItems = [];

const menuItems = [
  { name: 'Pizza', price: 10.99 },
  { name: 'Burger', price: 8.99 },
  { name: 'Salad', price: 5.99 },
];

function addToCart(dish) {
  const existingItem = cartItems.find((cartItem) => cartItem.name === dish);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const menuItem = menuItems.find((item) => item.name === dish);
    cartItems.push({ name: dish, quantity: 1, price: menuItem.price });
  }
  displayCartItems();
}

function removeFromCart(index) {
  cartItems[index].quantity--;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  displayCartItems();
}


function displayCartItems() {
  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';

  let totalAmount = 0;

  cartItems.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeFromCart(index));
    listItem.appendChild(removeButton);

    cartList.appendChild(listItem);

    totalAmount += item.price * item.quantity;
  });

  // Display the total amount in the cart
  const totalElement = document.getElementById('total');
  totalElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
}

function generateAndDownloadImage() {
  // Get the HTML element containing the cart items
  const cartItemsContainer = document.getElementById('cart-items');

  // Clone the cart items container and remove the "Remove" buttons from the clone
  const cartListClone = cartItemsContainer.cloneNode(true);
  const removeButtons = cartListClone.querySelectorAll('button');
  removeButtons.forEach(button => button.remove());

  // Create a new canvas element with a white background
  const canvas = document.createElement('canvas');
  canvas.width = 800; // Set the width of the canvas (adjust as needed)
  canvas.height = 800; // Set the height of the canvas (adjust as needed)
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // Set white background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the restaurant name on the canvas (centered)
  const restaurantName = 'Delicious Restaurant';
  const restaurantNameFontSize = 48; // Increase the font size for better visibility
  ctx.font = `${restaurantNameFontSize}px Arial`;
  ctx.fillStyle = '#333'; // Use a contrasting color for better visibility
  ctx.textAlign = 'center';
  ctx.fillText(restaurantName, canvas.width / 2, 100); // Adjust the vertical position

  // Get the current time and date
  const currentDate = new Date();
  const dateTime = currentDate.toLocaleString();
  const dateTimeFontSize = 24; // Increase the font size for better visibility
  ctx.font = `${dateTimeFontSize}px Arial`;
  ctx.fillText(dateTime, canvas.width / 2, 150); // Adjust the vertical position

  // Convert the cloned cart items container to an image using dom-to-image
  domtoimage.toBlob(cartListClone, { width: 800, height: 600 }).then(function (cartBlob) {
    // Create a new image element from the cart items image blob
    const cartImage = new Image();
    cartImage.src = URL.createObjectURL(cartBlob);

    // Wait for the cart image to load before drawing on the canvas
    cartImage.onload = function () {
      // Draw the cart items image on the canvas
      ctx.drawImage(cartImage, 0, 200); // Adjust the vertical position to make space for the restaurant name and date/time

      // Draw the total amount on the canvas
      const totalAmount = calculateTotalAmount();
      const totalAmountFontSize = 28;
      ctx.font = `${totalAmountFontSize}px Arial`;
      ctx.fillText(`Total: $${totalAmount.toFixed(2)}`, canvas.width / 2, canvas.height - 50);

      // Convert the canvas to an image blob
      canvas.toBlob(function (blob) {
        // Create an anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'cart.png'; // Set the filename for the downloaded image
        downloadLink.click(); // Trigger the download
      });
    };
  });
}


function calculateTotalAmount() {
  let totalAmount = 0;
  cartItems.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  return totalAmount;
}


document.getElementById('checkout-button').addEventListener('click', generateAndDownloadImage);
