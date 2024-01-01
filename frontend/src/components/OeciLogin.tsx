import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function OeciLogin() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // Access a cookie
    const cookieValue = Cookies.get("oeci");
    if (cookieValue) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    fetch("/api/oeci_login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          alert(response.json());
        }
      })
      .then((data) => {
        console.log("Success:", data);
        setHidden(true);
      });
  };

  return (
    <div hidden={hidden}>
      <form onSubmit={handleSubmit}>
        <div>OECI Login</div><input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
