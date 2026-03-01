import Map "mo:core/Map";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

module {
  // Original ClothingItem type.
  type OldClothingItem = {
    id : Text;
    name : Text;
    description : Text;
    imageBlob : Storage.ExternalBlob;
  };

  // Original actor type
  type OldActor = {
    clothingCatalog : Map.Map<Text, OldClothingItem>;
  };

  // New extended ClothingItem type with the price field.
  type NewClothingItem = {
    id : Text;
    name : Text;
    description : Text;
    price : ?Text;
    imageBlob : Storage.ExternalBlob;
  };

  // New actor type
  type NewActor = {
    clothingCatalog : Map.Map<Text, NewClothingItem>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    let newClothingCatalog = old.clothingCatalog.map<Text, OldClothingItem, NewClothingItem>(
      func(_id, oldClothingItem) {
        { oldClothingItem with price = null };
      }
    );
    { clothingCatalog = newClothingCatalog };
  };
};
