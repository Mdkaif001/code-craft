"use client";

import React, {
  useState,
  useEffect,
  useRef,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { api } from "../../../../convex/_generated/api";
import { useAction } from "convex/react";
import { X, Copy, Loader2, ZapIcon } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkDown from "react-markdown";

type FixWithAIDialogProps = {
  onClose: () => void;
};

const PreBlock = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) => {
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (codeRef.current) {
      const codeText = codeRef.current.textContent || "";
      navigator.clipboard.writeText(codeText);
      toast.success("Code copied!");
    }
  };

  return (
    <div className="relative overflow-auto w-full my-3 bg-[#232334] p-4 rounded-lg border border-[#313244]">
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          onClick={handleCopy}
          className="bg-[#313244] hover:bg-[#414156] p-1 rounded text-xs text-white transition"
          title="Copy code"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
      <pre ref={codeRef} {...props} className="pt-4" />
    </div>
  );
};

function AIDialog({ onClose }: FixWithAIDialogProps) {
  const { getCode, language, error } = useCodeEditorStore();
  const fixWithAI = useAction(api.fixBugWithAi.fixWithAI);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after a small delay to trigger the animation
    setTimeout(() => setIsVisible(true), 50);

    const fetchFix = async () => {
      try {
        const code = getCode();
        const result = await fixWithAI({
          code,
          error: error!,
          language,
        });

        setAiResult(result || "No suggestion available.");
      } catch (err) {
        console.error("AI Fix error:", err);
        toast.error("AI failed to fix the code.");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchFix();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start pointer-events-auto">
      <div
        className={`bg-[#1e1e2e] border-r border-[#313244] h-full w-full max-w-2xl shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#313244]">
          <div className="flex items-center space-x-2">
            <ZapIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              AI Fix Suggestion
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:text-gray-200 hover:bg-[#313244] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="text-gray-300">
                  Analyzing code and generating solution...
                </span>
              </div>
            ) : (
              <div className="text-sm overflow-auto leading-7">
                <ReactMarkDown
                  components={{
                    pre: PreBlock,
                    code: ({ ...props }) => (
                      <code
                        className="bg-[#232334] px-1 py-0.5 rounded-md"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong className="text-blue-400 font-bold" {...props} />
                    ),
                    hr: ({ ...props }) => <hr className="hidden" {...props} />,
                    h3: ({ ...props }) => (
                      <h3
                        className="text-lg font-bold text-purple-400 mt-5 mb-2"
                        {...props}
                      />
                    ),
                    h4: ({ ...props }) => (
                      <h4
                        className="text-md font-semibold text-blue-300 mt-3 mb-1"
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        className="list-disc pl-6 my-2 space-y-1"
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <li className="text-gray-200" {...props} />
                    ),
                    p: ({ ...props }) => (
                      <p className="mb-3 text-gray-300" {...props} />
                    ),
                  }}
                >
                  {aiResult || ""}
                </ReactMarkDown>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 h-full" onClick={handleClose} />
    </div>
  );
}

export default AIDialog;
