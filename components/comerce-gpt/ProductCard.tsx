import { useAddToCart } from '@/tanstack/cart';
import { IProduct } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';

export default function ProductCard({ product }: { product: IProduct }) {
    const skus = product.skus || [];
    const [selectedSkuIdx, setSelectedSkuIdx] = useState(0);
    const selectedSku = skus[selectedSkuIdx] || {};
    const [menuVisible, setMenuVisible] = useState(false);
    // Ưu tiên ảnh trong SKU, nếu không có thì lấy ảnh product
    let imageUrl = null;
    if (Array.isArray(selectedSku.images) && selectedSku.images.length > 0) {
      imageUrl = selectedSku.images[0];
    } else if (Array.isArray(product.image) && product.image.length > 0) {
      imageUrl = product.image[0];
    } else if (typeof product.image === 'string' && product.image) {
      imageUrl = product.image;
    }
    const hasImage = !!imageUrl;
    const price = selectedSku.price;
    const discount = selectedSku.discount || 0;
    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price; 
    const unit = selectedSku.variantName || selectedSku.unit;

    const addToCartMutation = useAddToCart();

    const handleAddToCart = () => {
        if (!selectedSku._id || !product._id) {
            return;
        }
        try {
            addToCartMutation.mutate({
                skuId: selectedSku._id,
                productId: product._id,
                skuName: selectedSku.variantName || selectedSku.unit || '',
                image: imageUrl || '',
                quantity: 1,
                selected: true,
                addedAt: new Date().toISOString(),
                priceSnapshot: price,
                discountSnapshot: discount,
                stockSnapshot: selectedSku.stock || 0,
            });
        } catch (e) {
           console.log("LỖI KHI TẠO MỚI SẢN PHẨM", e)
        }
    };

    return (
        <Provider>
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 10,
                marginVertical: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#eee',
                alignItems: 'center',
            }}>
                {/* Ảnh sản phẩm */}
                {hasImage ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 72, height: 72, borderRadius: 8, marginRight: 12, backgroundColor: '#f3f3f3' }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={{ width: 72, height: 72, borderRadius: 8, marginRight: 12, backgroundColor: '#f3f3f3' }} />
                )}
                {/* Thông tin sản phẩm */}
                <View style={{ flex: 1, position: 'relative' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>{product.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        {discount > 0 && (
                            <Text style={{ color: '#888', fontSize: 12, textDecorationLine: 'line-through', marginRight: 5 }}>
                                {price?.toLocaleString()}đ
                            </Text>
                        )}
                        <Text style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
                            {finalPrice?.toLocaleString()}đ
                        </Text>
                    </View>
                    {/* Menu chọn SKU và nút Thêm vào giỏ hàng cùng 1 hàng */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        {skus.length > 1 ? (
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    <Button
                                        mode="outlined"
                                        onPress={() => setMenuVisible(true)}
                                        style={styles.menuButton}
                                        labelStyle={{ color: '#555', fontSize: 13 }}
                                        contentStyle={{ height: 40 }}
                                    >
                                        {selectedSku.variantName || selectedSku.unit || 'Chọn loại'}
                                    </Button>
                                }
                            >
                                {skus.map((sku: any, idx: number) => (
                                    <Menu.Item
                                        key={sku._id || idx}
                                        onPress={() => {
                                            setSelectedSkuIdx(idx);
                                            setMenuVisible(false);
                                        }}
                                        title={sku.variantName || sku.unit || `SKU ${idx + 1}`}
                                    />
                                ))}
                            </Menu>
                        ) : (
                            unit && (
                                <View style={[styles.menuButton, { justifyContent: 'center', backgroundColor: '#fafafa', borderColor: '#eee', borderWidth: 1 }]}> 
                                    <Text style={{ fontSize: 13, color: '#555', textAlign: 'center' }}>{unit}</Text>
                                </View>
                            )
                        )}
                        <TouchableOpacity
                            onPress={handleAddToCart}
                            style={styles.squareCartButton}
                        >
                            <Ionicons name="cart-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        flex: 1,
        marginRight: 8,
        borderRadius: 8,
        minWidth: 110,
        maxWidth: 160,
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    squareCartButton: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#ff9c86',
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 