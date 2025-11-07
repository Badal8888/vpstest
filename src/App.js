import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiLogOut, FiUpload, FiDownload } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [link, setLink] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);
  const qrRef = useRef();

  // 🔐 Login
  const handleLogin = (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const pass = e.target.password.value;
    if (id === "admin" && pass === "PASSWORD") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid ID or Password");
    }
  };

  // 🚪 Logout
  const logout = () => {
    setIsLoggedIn(false);
    setLink("");
    setLogo(null);
  };

  // 🖼️ Upload Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ⬇️ Download QR Code
  const downloadQR = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const size = 600;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
          const logoSize = size * 0.2;
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = "qr_code.png";
          link.click();
          URL.revokeObjectURL(url);
        };
      } else {
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qr_code.png";
        link.click();
        URL.revokeObjectURL(url);
      }
    };
    img.src = url;
  };

  return (
    <div className="container py-5">
      {!isLoggedIn ? (
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card shadow-lg border-0">
              <div className="card-body">
                <h3 className="text-center mb-4 fw-bold text-primary">
                  TechStrota Login
                </h3>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="id"
                      placeholder="Enter ID"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Link ➜ QR Generator</h2>
            <p className="text-muted">Create HD QR codes with your custom logo</p>
          </div>

          <div className="row g-4">
            {/* Left Control Panel */}
            <div className="col-md-5">
              <div className="card shadow border-0">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">QR Settings</h5>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter your link here"
                    className="form-control mb-3"
                  />

                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <label className="form-label">QR Color</label>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="form-control form-control-color"
                      />
                    </div>
                    <div>
                      <label className="form-label">Background</label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="form-control form-control-color"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Logo</label>
                    <div className="input-group">
                      <label className="input-group-text" htmlFor="logoUpload">
                        <FiUpload />
                      </label>
                      <input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleLogoUpload}
                      />
                    </div>
                    {logo && (
                      <img
                        src={logo}
                        alt="Logo Preview"
                        className="mt-3 rounded shadow-sm"
                        width={80}
                        height={80}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setLink(link)}
                    className="btn btn-success w-100"
                  >
                    Generate QR
                  </button>
                </div>
              </div>
            </div>

            {/* Right Preview */}
            <div className="col-md-7 text-center">
              <div className="card shadow border-0 p-4" ref={qrRef}>
                {link ? (
                  <>
                    <QRCodeSVG
                      value={link}
                      size={260}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level="H"
                      includeMargin={true}
                    />
                    {logo && (
                      <img
                        src={logo}
                        alt="Center Logo"
                        className="position-absolute top-50 start-50 translate-middle rounded shadow-sm bg-white"
                        width={60}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <button
                      onClick={downloadQR}
                      className="btn btn-outline-success mt-3"
                    >
                      <FiDownload /> Download PNG
                    </button>
                  </>
                ) : (
                  <p className="text-muted">Your QR preview will appear here</p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <button onClick={logout} className="btn btn-danger">
              <FiLogOut /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
