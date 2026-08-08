import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ markdown }) {
  return (
    <div className="prose-genesis">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown || ""}</ReactMarkdown>
    </div>
  );
}