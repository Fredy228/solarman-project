"use client";

import { AuthPage } from "@refinedev/mui";

export default function Login() {
  return (
    <AuthPage
      type="login"
      title={
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>Моя Админка</div>
      }
      formProps={
        {
          // initialValues: { email: "admin@example.com" },
        }
      }
    />
  );
}
