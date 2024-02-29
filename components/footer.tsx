import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="mt-6 w-full  p-6  bg-background  border-t shadow-sm">
      <div className=" w-full justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
