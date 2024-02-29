import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import SubmitButton from "../_components/submit-button";

const getData = async (id: string) => {
  // vercel by default cache data, so page would be static,that's why we use noStore() to dynamically display data whenever we fetch
  noStore();
  const data = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      colorSchema: true,
    },
  });

  return data;
};

const SettingsPage = async () => {
  // taking logged in userId  and sending via prisma to db compare if ID matches, if yes, data about user is  send back
  const user = await currentUser();
  const userData = await getData(user?.id as string);

  //server-action to change/save data
  const postData = async (formData: FormData) => {
    "use server";

    const name = formData.get("name") as string;
    const colorSchema = formData.get("color") as string;

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? undefined,
        colorSchema: colorSchema ?? undefined,
      },
    });
    //i want to revalidate cache of rootLayout (refresh)
    revalidatePath("/", "layout");
  };

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl ">Settings</h1>
          <p className="text-lg text-muted-foreground">your profile settings</p>
        </div>
      </div>

      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please, provide general information about yourself and save
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Your Name</Label>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Your name"
                  defaultValue={userData?.name ?? undefined}
                />
              </div>
              <div className="space-y-1">
                <Label>Your Email</Label>
                <Input
                  name="email"
                  type="text"
                  id="email"
                  placeholder="Your email"
                  defaultValue={userData?.email ?? undefined}
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label>Color Schema</Label>
                <Select
                  name="color"
                  defaultValue={userData?.colorSchema ?? undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value="theme-green">Green</SelectItem>
                      <SelectItem value="theme-blue">Blue</SelectItem>
                      <SelectItem value="theme-orange">Orange</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
