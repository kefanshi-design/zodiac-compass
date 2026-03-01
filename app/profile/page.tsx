// app/profile/page.tsx
import { Suspense } from "react";
import ProfileClient from "./profile-client";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1C1F4E]" />}>
      <ProfileClient />
    </Suspense>
  );
}