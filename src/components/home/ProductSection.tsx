import ProductCard from "../common/ProductCard";
import { TotalProduct } from "../../services/CustomerAPI";
import { useEffect, useState } from "react";
const BASE_IMAGE = "https://localhost:7114";
type Product = {
  image: string;
  name: string;
  sold: number;
};

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await TotalProduct.getTotalProduct();

      const mapped: Product[] = res.map((item: any) => ({
        image: `${BASE_IMAGE}${item.imageURL}`,
        name: item.coffeeName,
        sold: item.totalSold,
      }));

      setProducts(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="content products">
      <h2 style={{ textAlign: "center" }}>SẢN PHẨM CỦA CHÚNG TÔI</h2>

      <div className="product-content">
        {products.map((item, index) => (
          <ProductCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
}
