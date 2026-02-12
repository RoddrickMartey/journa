// scr/components/ToolBar.tsx

import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Redo, Underline, Undo } from "lucide-react";
import type { ReactNode } from "react";

interface BaseToolbarProps {
  editor: Editor | null;
  label: string;
}

interface CodeToolbarProps extends BaseToolbarProps {
  language: string;
}

const ToolbarShell = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="border-b bg-muted/40">
      <div className="px-3 pt-2 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1 px-2 pb-2 pt-1">{children}</div>
    </div>
  );
};

const IconButton = ({
  onClick,
  disabled,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}) => {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? "secondary" : "ghost"}
      className="h-8 w-8"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export const CodeToolbar = ({ editor, label, language }: CodeToolbarProps) => {
  if (!editor) return null;

  return (
    <ToolbarShell label={`${label} • ${language}`}>
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo size={16} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo size={16} />
      </IconButton>
    </ToolbarShell>
  );
};

export const ParagraphToolbar = ({ editor, label }: BaseToolbarProps) => {
  if (!editor) return null;

  return (
    <ToolbarShell label={label}>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={16} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic size={16} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <Underline size={16} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo size={16} />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo size={16} />
      </IconButton>
    </ToolbarShell>
  );
};
