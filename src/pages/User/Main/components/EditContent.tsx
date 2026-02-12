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
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";

interface EditContentProps {
  content: OutputData | null;
  postId: string;
  loading: boolean;
  refetch?: () => void;
  // Simplified the type to a plain async function to avoid mutation version conflicts
  saveContent: (data: OutputData) => Promise<any>;
}

export const EditContent = ({
  content,
  loading,
  refetch,
  saveContent,
}: EditContentProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const isInitialized = useRef(false);

  // 1. Initialize EditorJS only once on mount
  useEffect(() => {
    if (isInitialized.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: {
          class: Header as any,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List as any,
          inlineToolbar: true,
          config: { defaultStyle: "unordered" },
        },
        quote: {
          class: Quote as any,
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
                const base64 = await compressAndConvertToBase64(file);
                const res = await api.post("/posts/post-image-upload", {
                  imageBase64: base64,
                });
                return { success: 1, file: { url: res.data.url } };
              },
            },
          },
        },
      },
      // Initial data only
      data: content ?? undefined,
      placeholder: content ? undefined : "Start writing...",
      onReady: () => {
        editorRef.current = editor;
      },
    });

    isInitialized.current = true;

    // Cleanup: destroy editor when component unmounts
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
  }, []); // Empty array ensures this only runs once

  // 2. Separate logic for handling ReadOnly/Loading state
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.isReady) {
      editor.isReady
        .then(() => {
          // Safe check for readOnly toggle
          if (editor.readOnly) {
            editor.readOnly.toggle(loading);
          }
        })
        .catch((err) => console.error("Editor not ready for toggle", err));
    }
  }, [loading]);

  const save = async () => {
    if (!editorRef.current) return;

    try {
      const data = await editorRef.current.save();
      await saveContent(data);
      refetch?.();
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save post");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
      <div className="rounded-2xl border bg-card/50 p-4 shadow-sm md:p-8">
        <h1 className="mb-6 text-xl font-semibold tracking-tight md:text-2xl flex items-center justify-between">
          Edit Post Content{" "}
          <span className="text-sm text-muted-foreground font-normal">
            {content?.time
              ? `Last saved: ${format(new Date(content.time), "PPpp")}`
              : "Not saved yet"}
          </span>
        </h1>

        <div
          className={`relative transition-opacity duration-300 ${
            loading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <div
            id="editorjs"
            className="prose prose-stone max-w-none dark:prose-invert min-h-100 
            [&_.ce-block__content]:max-w-none 
            [&_.ce-toolbar__content]:max-w-none 
            [&_.ce-toolbar]:-left-4"
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-end gap-4 border-t pt-6 sm:flex-row">
          <Button
            onClick={save}
            disabled={loading}
            className="w-full sm:w-auto md:px-10"
          >
            {loading ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
