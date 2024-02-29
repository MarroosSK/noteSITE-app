"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import img1 from "../public/editor.jpg";
import img2 from "../public/settings.jpg";
import img3 from "../public/subscribe.jpg";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
// Default theme
import "@splidejs/react-splide/css/core";
import { AutoplayExample } from "./auto-splide";
import { ReactivityExample } from "./dynamic-splide";
import {
  DoorClosed,
  Handshake,
  NotebookPen,
  Option,
  Palette,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";

const heroData = [
  {
    img: img1,
    imgNumber: 1,
    title: "Notion like editor",
    icon: NotebookPen,
  },
  {
    img: img2,
    imgNumber: 2,
    title: "Customizable settings",
    icon: Palette,
  },
  {
    img: img3,
    imgNumber: 3,
    title: "Subscription ",
    icon: Handshake,
  },
];

const SubHero = () => {
  const [currentImage, setCurrentImage] = useState(img1);
  const handleImage = (imagePosition: number) => {
    const imageIWant = heroData.find(
      (item) => item.imgNumber === imagePosition
    );

    if (imageIWant) {
      setCurrentImage(imageIWant.img);
    }
  };

  return (
    <div className="mt-10 md:mt-24 flex flex-col items-center space-y-24 justify-center px-5 py-12 mx-auto lg:px-16 max-w-7x6 md:px-12">
      <div className="flex flex-col md:flex-row items-center gap-2">
        {heroData.map((data) => (
          <div
            key={data.title}
            className={cn(
              "m-2 flex  items-center justify-center flex-col gap-y-3 text-slate-400 cursor-pointer p-4 rounded-md",
              currentImage === data.img
                ? "text-slate-800 border border-slate-800"
                : ""
            )}
            onClick={() => handleImage(data.imgNumber)}
          >
            <data.icon className="mr-2 h-8 w-8 text-primary" />
            <p>{data.title}</p>
          </div>
        ))}
      </div>
      <div className=" w-[250px] sm:w-[500px] h-[300px]">
        {currentImage && (
          <Image
            src={currentImage}
            alt="Image preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default SubHero;
