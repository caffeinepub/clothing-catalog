import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type ClothingItem = {
    id : Text;
    name : Text;
    description : Text;
    price : ?Text;
    imageBlob : Storage.ExternalBlob;
  };

  module ClothingItem {
    public func compare(clothing1 : ClothingItem, clothing2 : ClothingItem) : Order.Order {
      Text.compare(clothing1.name, clothing2.name);
    };
  };

  let clothingCatalog = Map.empty<Text, ClothingItem>();

  public shared ({ caller }) func addClothingItem(id : Text, name : Text, description : Text, price : ?Text, imageBlob : Storage.ExternalBlob) : async () {
    let item : ClothingItem = {
      id;
      name;
      description;
      price;
      imageBlob;
    };
    clothingCatalog.add(id, item);
  };

  public query ({ caller }) func getAllClothingItems() : async [ClothingItem] {
    clothingCatalog.values().toArray().sort();
  };

  public query ({ caller }) func getClothingItem(id : Text) : async ClothingItem {
    switch (clothingCatalog.get(id)) {
      case (null) { Runtime.trap("Clothing item does not exist") };
      case (?item) { item };
    };
  };

  public shared ({ caller }) func updateClothingItem(id : Text, name : Text, description : Text, price : ?Text, imageBlob : Storage.ExternalBlob) : async () {
    switch (clothingCatalog.get(id)) {
      case (null) { Runtime.trap("Clothing item does not exist") };
      case (?_) {
        let newItem : ClothingItem = {
          id;
          name;
          description;
          price;
          imageBlob;
        };
        clothingCatalog.add(id, newItem);
      };
    };
  };

  public shared ({ caller }) func deleteClothingItem(id : Text) : async () {
    switch (clothingCatalog.get(id)) {
      case (null) { Runtime.trap("Clothing item does not exist") };
      case (?_) {
        clothingCatalog.remove(id);
      };
    };
  };
};
