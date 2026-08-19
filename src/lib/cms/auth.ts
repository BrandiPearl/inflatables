import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CMS_COOKIE,
  CMS_COOKIE_MAX_AGE,
  expectedSessionToken,
  isValidSession,
} from "@/lib/cms/session";

export async function requireCmsSession() {
  const store = await cookies();
  const token = store.get(CMS_COOKIE)?.value;
  if (!(await isValidSession(token))) {
    redirect("/admin/login");
  }
}

export async function setCmsSessionCookie() {
  const token = await expectedSessionToken();
  if (!token) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  const store = await cookies();
  store.set(CMS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CMS_COOKIE_MAX_AGE,
  });
}

export async function clearCmsSessionCookie() {
  const store = await cookies();
  store.delete(CMS_COOKIE);
}
