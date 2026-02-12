import { useEffect, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import TextStyle from "@skchawala/editorjs-text-style";
import ImageTool from "@editorjs/image";
import { api } from "@/lib/axios";
import { compressAndConvertToBase64 } from "@/lib/compressAndConvertToBase64";
import { Button } from "@/components/ui/button";

export const ExampleEditor = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    const initEditor = () => {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: { defaultStyle: "unordered" },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Author",
            },
          },
          code: Code,
          textStyle: { class: TextStyle },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  try {
                    const base64 = await compressAndConvertToBase64(file);
                    const res = await api.post("/posts/post-image-upload", {
                      imageBase64: base64,
                    });
                    return { success: 1, file: { url: res.data.url } };
                  } catch (error) {
                    console.log(error);
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },
        placeholder: "Start writing...",
        onReady: () => {
          editorRef.current = editor;
        },
      });
    };

    initEditor();
    isInitialized.current = true;

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  const save = async () => {
    if (editorRef.current) {
      try {
        const data: OutputData = await editorRef.current.save();
        console.log(data);
      } catch (error) {
        console.error("Saving failed: ", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 p-5 border rounded-xl shadow-sm bg-card">
      {/* EDITOR UI */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Edit Your content</h3>
        <div className="p-6 transition-all ">
          <div
            id="editorjs"
            className="prose prose-stone dark:prose-invert min-h-100[400px] max-w-full"
          />
          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button onClick={save}>Generate Blog Preview</Button>
          </div>
        </div>
      </section>
    </div>
  );
};
