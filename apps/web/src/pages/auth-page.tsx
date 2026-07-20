import { ShieldCheck } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthPage } from "@/hooks/authPage";

export function AuthPage() {
  const auth = useAuthPage();

  if (auth.isAuthenticated && auth.user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-border/70 bg-card/80 shadow-none">
        <CardContent className="grid gap-6 p-8">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-7" />
          </div>
          <div className="grid gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              Acceso al workspace de Yuno
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Inicia sesion o crea una cuenta para trabajar con projects, tasks
              y el resto de recursos desde una capa tipada compartida.
            </p>
          </div>
          <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
            <p>Servicios desacoplados por recurso.</p>
            <p>Hooks por vista para lectura y mutaciones.</p>
            <p>Token persistente y recuperacion de usuario actual.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/92">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>
            {auth.mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
          </CardTitle>
          <div className="flex gap-2 rounded-full bg-background p-1">
            <Button
              type="button"
              size="sm"
              variant={auth.mode === "login" ? "default" : "ghost"}
              onClick={() => auth.setMode("login")}
            >
              Login
            </Button>
            <Button
              type="button"
              size="sm"
              variant={auth.mode === "register" ? "default" : "ghost"}
              onClick={() => auth.setMode("register")}
            >
              Registro
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {auth.mode === "login" ? (
            <>
              <label className="grid gap-2">
                <Label>Nombre</Label>
                <Input
                  value={auth.loginValues.name}
                  onChange={(event) =>
                    auth.setLoginValues((currentValue) => ({
                      ...currentValue,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Tu usuario"
                />
              </label>
              <label className="grid gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={auth.loginValues.password}
                  onChange={(event) =>
                    auth.setLoginValues((currentValue) => ({
                      ...currentValue,
                      password: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
              </label>
            </>
          ) : (
            <>
              <label className="grid gap-2">
                <Label>Nombre</Label>
                <Input
                  value={auth.registerValues.name}
                  onChange={(event) =>
                    auth.setRegisterValues((currentValue) => ({
                      ...currentValue,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Nombre visible"
                />
              </label>
              <label className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={auth.registerValues.email}
                  onChange={(event) =>
                    auth.setRegisterValues((currentValue) => ({
                      ...currentValue,
                      email: event.target.value,
                    }))
                  }
                  placeholder="tu@equipo.com"
                />
              </label>
              <label className="grid gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={auth.registerValues.password}
                  onChange={(event) =>
                    auth.setRegisterValues((currentValue) => ({
                      ...currentValue,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Minimo 5 caracteres"
                />
              </label>
            </>
          )}

          <Button
            type="button"
            disabled={auth.isSubmitting}
            onClick={() => void auth.submit()}
          >
            {auth.isSubmitting
              ? "Procesando..."
              : auth.mode === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </Button>

          {auth.error ? (
            <p className="text-sm text-red-600">{auth.error}</p>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
