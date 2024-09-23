import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item-input');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;
      li.dataset.id = item.id;
      li.addEventListener('click', toggleItem);
      li.querySelector('.delete-btn').addEventListener('click', deleteItem);
      shoppingList.appendChild(li);
    });
  }

  // Function to add a new item
  async function addItem(e) {
    e.preventDefault();
    const text = newItemInput.value.trim();
    if (text) {
      await backend.addItem(text);
      newItemInput.value = '';
      renderShoppingList();
    }
  }

  // Function to toggle item completion
  async function toggleItem(e) {
    if (e.target.tagName === 'SPAN') {
      const id = parseInt(e.currentTarget.dataset.id);
      await backend.toggleItem(id);
      renderShoppingList();
    }
  }

  // Function to delete an item
  async function deleteItem(e) {
    e.stopPropagation();
    const id = parseInt(e.currentTarget.parentElement.dataset.id);
    await backend.deleteItem(id);
    renderShoppingList();
  }

  // Event listeners
  addItemForm.addEventListener('submit', addItem);

  // Initial render
  renderShoppingList();
});
