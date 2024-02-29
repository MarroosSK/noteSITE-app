"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React from "react";
import { Button } from "./ui/button";

import { useMutation } from "@tanstack/react-query";

import { postData } from "@/app/actions/update-note";

import { Color } from "@tiptap/extension-color";
import FloatingMenu from "@tiptap/extension-floating-menu";
import TextStyle from "@tiptap/extension-text-style";
import { toast } from "sonner";
import TipTapFloatMenuBar from "./tiptap-floatmenu";
import TipTapMenuBar from "./tiptap-menu";

type Props = { note: any };

const TipTapEditor = ({ note }: Props) => {
  const [editorState, setEditorState] = React.useState(
    `<h1>${note.description}</h1>`
  );
  // console.log(note);

  const saveNote = useMutation({
    mutationFn: async () => {
      await postData(editorState, note.id);
      return;
    },
  });

  const editor = useEditor({
    autofocus: true,
    editable: true,
    injectCSS: false,
    extensions: [
      StarterKit,
      FloatingMenu.configure({
        shouldShow: ({ editor }) => {
          // show the floating within any paragraph
          return editor.isActive("paragraph");
        },
      }),
      TextStyle,
      Color,
    ],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const handleSave = () => {
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        toast.success("Note has been updated!");
      },
      onError: (err) => {
        toast.error("Something went wrong!");
      },
    });
  };

  return (
    <>
      <div className="flex">{editor && <TipTapMenuBar editor={editor} />}</div>
      <div className="flex">
        {editor && <TipTapFloatMenuBar editor={editor} />}
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      {saveNote.isPending ? (
        <Button disabled>saving</Button>
      ) : (
        <Button onClick={handleSave} variant={"outline"}>
          save
        </Button>
      )}
    </>
  );
};

export default TipTapEditor;
