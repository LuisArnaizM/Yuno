import { useState } from "react";
import { createUserSchema, loginSchema } from "@yuno/shared-types";
import { ApiError } from "@/lib/api-client";
import { useAppSession } from "@/providers/app-session-provider";

type AuthMode = "login" | "register";

export function useAuthPage() {
  const session = useAppSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginValues, setLoginValues] = useState({ name: "", password: "" });
  const [registerValues, setRegisterValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const payload = loginSchema.parse(loginValues);
        await session.login(payload);
      } else {
        const payload = createUserSchema.parse(registerValues);
        await session.register(payload);
      }
    } catch (errorValue) {
      if (errorValue instanceof ApiError) {
        setError(errorValue.message);
      } else if (errorValue instanceof Error) {
        setError(errorValue.message);
      } else {
        setError("No se pudo completar la autenticacion");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...session,
    mode,
    setMode,
    loginValues,
    setLoginValues,
    registerValues,
    setRegisterValues,
    error,
    isSubmitting,
    submit,
  };
}