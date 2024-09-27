import React, { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface MyEditorProps {
  onChange: (content: string) => void;
  initialContent?: string; // Optional initial content prop
}

const VITE_TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;

const MyEditor: React.FC<MyEditorProps> = ({ onChange, initialContent }) => {
  useEffect(() => {
    if (initialContent) {
      // Optionally handle any changes or effects here if needed
    }
  }, [initialContent]);

  return (
    <Editor
      apiKey={VITE_TINYMCE_API_KEY}
      initialValue={
        initialContent || "<p></p>"
      }
      init={{
        initialValue: "",
        height: 500,
        menubar: true,
        plugins: [
          "image",
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
          "anchor",
        ],
        toolbar:
          "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={(content) => {
        onChange(content);
      }}
    />
  );
};

export default MyEditor;
