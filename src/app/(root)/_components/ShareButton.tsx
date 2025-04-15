"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ShareSnippetDialog from "./ShareSnippetDialog";
import { ShareIcon } from "lucide-react";

export const ShareButton = () => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsShareDialogOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
      >
        <ShareIcon className="size-4 text-white" />
        <span className="text-md font-mono text-white ">Share</span>
      </motion.button>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </>
  );
};
