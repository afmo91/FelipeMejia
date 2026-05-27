"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage(){const [error,setError]=useState("");return <section className="section"><h1 className="text-4xl">Login</h1><form className="mt-8 grid max-w-md gap-4" onSubmit={async(e)=>{e.preventDefault();const f=new FormData(e.currentTarget);const res=await signIn("credentials",{username:f.get("username"),password:f.get("password"),redirect:true,callbackUrl:"/cv/product-manager"});if(res?.error) setError("Invalid credentials");}}><input name="username" className="bg-black/40 p-3" placeholder="Username"/><input name="password" type="password" className="bg-black/40 p-3" placeholder="Password"/><button className="bg-accent p-3 text-black">Sign in</button></form>{error && <p>{error}</p>}</section>;}
