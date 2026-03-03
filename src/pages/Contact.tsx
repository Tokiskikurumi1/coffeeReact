export default function Contact() {
  return (
    <div className="container">
      <div className="content slogan slogan-contact">
        <h3>MINH COFFEE</h3>
        <span>"Hương vị đậm đà – Kết nối mọi khoảnh khắc!"</span>
      </div>

      <div className="content infor-contact">
        <span>
          <i className="fa-solid fa-map-location-dot"></i>Địa chỉ:Hòa Đam - Hòa
          Phong - Mỹ Hào - Hưng Yên
        </span>
        <br />
        <span>
          <i className="fa-solid fa-phone-volume"></i>Hotline: 0123456789
        </span>
        <br />
        <span>
          <i className="fa-solid fa-envelope"></i>Email:
          minhneahihi123@gmail.com
        </span>
      </div>

      <div className="content fill-infor">
        <h2>Liên hệ</h2>
        <div className="text-fill">
          <input type="text" placeholder="Họ và tên*" />
          <input type="text" placeholder="Email*" />
          <textarea placeholder="Nội dung*"></textarea>
        </div>
        <span className="btn-send">Gửi</span>
      </div>
    </div>
  );
}
