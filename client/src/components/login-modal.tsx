import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { login } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: any) => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      onSuccess(data.user);
      onOpenChange(false);
      toast({
        title: "Welcome to AgreeGrow!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    loginMutation.mutate({ email, username });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">Welcome to AgreeGrow</DialogTitle>
          <p className="text-muted-foreground">Smart Farming. Smarter Future.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="username">Name (Optional)</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-username"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loginMutation.isPending}
            data-testid="button-login"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo: Use any email to access the platform
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
