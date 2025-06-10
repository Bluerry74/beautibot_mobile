import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://be-wdp.onrender.com/product")
      .then((res) => {
        console.log("Data fetched:", res.data);
        setProducts(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name}</Text>
      <Text>{item.brand}</Text>
      <Text>Skus:</Text>
      {item.skus.map((sku, index) => (
        <View key={index}>
          <Text key={sku._id || index}>{sku.variantName}</Text>
          <Text> Price: {sku.price.toLocaleString()} VND</Text>
          <Text>
            {" "}
            {sku.discount ? `Discount: ${sku.discount.toLocaleString()} VND` : "No Discount"}
          </Text>
          <Text>
            {" "}
            Dimensions: {sku.dimensions ? `${sku.dimensions.length} x ${sku.dimensions.width} x ${sku.dimensions.height} cm` : "N/A"}
          </Text>
        </View>
      ))}
    </View>
  );

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1, marginTop: 25 }}>
      <FlatList
        data={products}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
      />
      <Text style={{ textAlign: "center", fontSize: 20, marginTop: 20 }}>
        Products Page
      </Text>
    </View>
  );
}

export default Products;
