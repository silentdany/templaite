import Link from "next/link";
import { isGoogleAuthConfigured } from "@/lib/google-auth";
import { SignupForm } from "./signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  const showGoogle = isGoogleAuthConfigured();

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm showGoogle={showGoogle} />
        </CardContent>
      </Card>
    </div>
  );
}
