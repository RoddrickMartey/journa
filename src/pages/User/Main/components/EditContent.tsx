"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import { api } from "@/lib/axios";
import { compressAndConvertToBase64 } from "@/lib/compressAndConvertToBase64";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { EditorCropImage } from "../../components/EditorCropImage";

interface EditContentProps {
  content: OutputData | null;
  postId: string;
  loading: boolean;
  refetch?: () => void;
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

  // Updated Refs to handle both success and failure
  const cropResolverRef = useRef<{
    resolve: (file: File) => void;
    reject: () => void;
  } | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const openCropModal = (src: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      cropResolverRef.current = { resolve, reject };
      setCropImageSrc(src);
    });
  };

  useEffect(() => {
    if (isInitialized.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: {
          class: Header as any,
          inlineToolbar: true, // Allows bold/italic inside the header
          shortcut: "CMD+SHIFT+H",
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
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                try {
                  const base64 = await compressAndConvertToBase64(file);

                  // This will now throw an error if cropResolverRef.current.reject() is called
                  const croppedFile = await openCropModal(base64);

                  const compressed =
                    await compressAndConvertToBase64(croppedFile);

                  const res = await api.post("/posts/post-image-upload", {
                    imageBase64: compressed,
                  });

                  return {
                    success: 1,
                    file: { url: res.data.url },
                  };
                } catch (err) {
                  console.log("Upload or crop cancelled/failed");
                  return { success: 0 }; // Tells EditorJS upload failed
                }
              },
            },
          },
        },
      },
      data: content ?? undefined,
      placeholder: content ? undefined : "Start writing...",
      onReady: () => {
        editorRef.current = editor;
      },
    });

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

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.isReady) {
      editor.isReady
        .then(() => {
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
            [&_.ce-toolbar]:-left-4
            [&_.ce-header[data-level='1']]:text-4xl
            [&_.ce-header[data-level='2']]:text-3xl
            [&_.ce-header[data-level='3']]:text-2xl
            [&_.ce-header[data-level='4']]:text-xl
            [&_.ce-header]:font-bold"
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

      {cropImageSrc && (
        <EditorCropImage
          imageSrc={cropImageSrc}
          // The aspect is now handled internally by the component's state
          loading={loading}
          onCancel={() => {
            cropResolverRef.current?.reject(); // Reject the promise
            cropResolverRef.current = null;
            setCropImageSrc(null);
          }}
          onComplete={(file) => {
            cropResolverRef.current?.resolve(file); // Resolve the promise
            cropResolverRef.current = null;
            setCropImageSrc(null);
          }}
        />
      )}
    </div>
  );
};
