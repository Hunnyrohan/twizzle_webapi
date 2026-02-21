"use client";
import axios from "@/lib/axios";

export default function CreateUser() {
  const submit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    await axios.post("/admin/users", form);
    alert("User created");
  };

  return (
    <form onSubmit={submit}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <input name="password" placeholder="Password" />
      <input type="file" name="image" />
      <button>Create</button>
    </form>
  );
}
