import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./MarkdownEditor.css";

const MarkdownEditor = ({
  mode,
  content,
  inputRef,
  handleChange,
  imageURL,
}: any) => {
  return (
    <div
      className="input-container"
      style={{
        backgroundImage: imageURL ? `url(${imageURL})` : "none", // Apply the uploaded image as background
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {mode === "write" ? (
        <textarea
          autoFocus
          ref={inputRef}
          value={content}
          onChange={handleChange}
          className="textarea"
          placeholder="Write down your note..."
        />
      ) : (
        <div ref={inputRef} className="textread">
          <ReactMarkdown
            className="markdown-editor"
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            children={content}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
