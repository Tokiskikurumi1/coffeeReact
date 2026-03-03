import ProductCard from "../common/ProductCard";

export default function ProductSection() {
  const products = [
    { id: 1, name: "Cà phê đá", sold: 10000, image: "/images/capheda.png" },
    { id: 2, name: "Cà phê muối", sold: 9000, image: "/images/caphemuoi.png" },
    { id: 3, name: "Cà phê đá", sold: 10000, image: "/images/capheda.png" },
    { id: 4, name: "Cà phê muối", sold: 9000, image: "/images/caphemuoi.png" },
  ];

  return (
    <div className="content products">
      <h2>SẢN PHẨM CỦA CHÚNG TÔI</h2>
      <div className="product-content">
        {products.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
