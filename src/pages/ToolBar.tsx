import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { Bold, Italic, List, Undo, Redo } from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b ">
      <Button onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={18} />
      </Button>

      <Button onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={18} />
      </Button>

      <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={18} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <Button onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={18} />
      </Button>
      <Button onClick={() => editor.chain().focus().redo().run()}>
        <Redo size={18} />
      </Button>
    </div>
  );
};
