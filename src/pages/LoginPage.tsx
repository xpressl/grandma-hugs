import { useState } from "react";
import { useAccessCode } from "@/hooks/useAccessCode";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginPage = () => {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const { login } = useAccessCode();

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please enter your access code");
      return;
    }
    setChecking(true);
    const { data, error } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code.trim())
      .single();

    if (error || !data) {
      toast.error("Invalid code. Please try again.");
      setChecking(false);
      return;
    }

    login(code.trim());
    toast.success(`Welcome, ${data.name}! 💛`);
    setChecking(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm text-center space-y-6">
        <div>
          <p className="text-6xl mb-4">👵💛</p>
          <h1 className="font-display text-grandma-2xl text-foreground">GrandmaJoy</h1>
          <p className="text-grandma-base text-muted-foreground mt-2">
            Enter your family access code
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter code..."
            className="w-full rounded-2xl border border-border bg-card p-4 text-grandma-base text-foreground text-center tracking-widest"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={checking}
            className="grandma-button w-full bg-primary text-primary-foreground rounded-2xl shadow-lg"
          >
            {checking ? "Checking..." : "Enter →"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Ask your family admin for an access code
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
