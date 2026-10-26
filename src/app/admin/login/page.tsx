"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }) });
    if (res.ok) router.push("/admin"); else setError((await res.json()).error);
  }
  return (
    <form onSubmit={submit} className="login-form">
      <h1>Admin login</h1>
      <label>Email<input name="email" type="email" required /></label>
      <label>Password<input name="password" type="password" required /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn">Log in</button>
    </form>
  );
}
