// src/components/editor/TiptapEditor.jsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

import MenuBar from './MenuBar';
// Bỏ import './TiptapStyles.css';

const TiptapEditor = ({ initialContent = '', onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Bạn có thể muốn tắt một số style mặc định của StarterKit nếu @tailwindcss/typography đã xử lý
        // Ví dụ: heading: { levels: [1, 2, 3], }, // giữ lại heading
        // paragraph: {}, // giữ lại paragraph
        // bold: {}, // giữ lại bold
        // ...
        // Hoặc để mặc định nếu muốn các extension của StarterKit vẫn áp dụng class của chúng
        // (ví dụ class 'ProseMirror-ನೇ انتخاب شوی' cho node được chọn)
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        // HTMLAttributes: { // Thêm class Tailwind cho link nếu muốn (typography sẽ làm việc này)
        //   class: 'text-blue-600 hover:text-blue-800 underline',
        // },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        // HTMLAttributes: { // Thêm class Tailwind cho ảnh
        //   class: 'max-w-full h-auto rounded-lg my-4',
        // },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      FontFamily,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        // Class này sẽ được áp dụng cho thẻ div bọc ngoài cùng của vùng soạn thảo (thẻ .ProseMirror)
        // Chúng ta sẽ áp dụng class 'prose' ở component cha để style nội dung
        class:
          'focus:outline-none p-4 min-h-[250px] max-h-[500px] overflow-y-auto',
      },
    },
  });

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
      <MenuBar editor={editor} />
      {/* 
        Bọc EditorContent trong một div với class "prose" 
        để @tailwindcss/typography áp dụng style.
        Bạn có thể chọn các biến thể như prose-sm, prose-lg, prose-slate, prose-invert (cho dark mode), v.v.
      */}
      <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
