import Bool "mo:base/Bool";
import Func "mo:base/Func";
import List "mo:base/List";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor ShoppingList {
  // Define the structure of a shopping list item
  type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  // Stable variable to store the shopping list items
  stable var items : [Item] = [];
  stable var nextId : Nat = 0;

  // Function to add a new item to the list
  public func addItem(text: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem : Item = {
      id = id;
      text = text;
      completed = false;
    };
    items := Array.append(items, [newItem]);
    id
  };

  // Function to get all items
  public query func getItems() : async [Item] {
    items
  };

  // Function to toggle the completed status of an item
  public func toggleItem(id: Nat) : async Bool {
    let index = Array.indexOf<Item>({ id = id; text = ""; completed = false }, items, func(a, b) { a.id == b.id });
    switch (index) {
      case null { false };
      case (?i) {
        let updatedItem = {
          id = items[i].id;
          text = items[i].text;
          completed = not items[i].completed;
        };
        items := Array.tabulate<Item>(items.size(), func (j) {
          if (j == i) updatedItem else items[j]
        });
        true
      };
    }
  };

  // Function to delete an item
  public func deleteItem(id: Nat) : async Bool {
    let newItems = Array.filter<Item>(items, func(item) { item.id != id });
    if (newItems.size() < items.size()) {
      items := newItems;
      true
    } else {
      false
    }
  };
}
