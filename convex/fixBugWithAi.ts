// convex/fixBugWithAi.ts
import { action } from "./_generated/server";
import OpenAI from "openai";
import { v } from "convex/values";

export const fixWithAI = action({
  args: {
    code: v.string(),
    error: v.string(),
    language: v.string(),
  },
  handler: async (ctx, { code, error, language }) => {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_SECRET_KEY!,
    });

    const prompt = `
    # Code Analysis Task
    
    You are an expert ${language} developer with 10+ years of experience debugging complex codebases. A developer needs your help fixing the following code that's producing an error.
    
    ## Source Code
    \`\`\`${language}
    ${code}
    \`\`\`
    
    ## Error Message
    \`\`\`
    ${error}
    \`\`\`
    
    ## Your Task
    Analyze this problem methodically and provide a solution:
    
    ### 1. Error Analysis
    **Identify the exact cause of the error** with line numbers and specific patterns that created this issue.
    
    ### 2. Fixed Code
    Provide the complete corrected code below. Make minimal changes while fixing the issue:
    \`\`\`${language}
    // Your corrected code here (complete solution)
    \`\`\`
    
    ### 3. Solution Explanation
    Explain how your fix resolves the problem and why it works. Be specific about each change made.
    
    ### 4. Key Improvements
    * **Point 1**: First key improvement
    * **Point 2**: Second key improvement 
    * **Point 3**: Third key improvement with performance or security implications
    
    ### 5. Best Practices
    Share 1-2 essential best practices that would prevent similar errors in future development.
    
    **Important formatting rules:**
    - Use **bold text** for important concepts
    - Create clear section headers with markdown heading syntax
    - Keep code blocks properly formatted with language specification
    - Use bullet points for lists
    - Keep explanations concise and developer-focused
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
      top_p: 0.9,
    });

    const content = completion.choices[0].message.content || "";

    return content;
  },
});
