"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export default function StripeButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          Subscribe Now
        </Button>
      )}
    </>
  );
}
