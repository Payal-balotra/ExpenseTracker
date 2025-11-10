const OpenAI = require("openai");
const Groq = require("groq-sdk");
const axios = require("axios");

const AI_PROVIDER = (process.env.AI_PROVIDER || "groq").toLowerCase();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const CHAT_MODEL = process.env.AI_CHAT_MODEL || "llama3-8b-8192";
const GENERAL_MODEL = process.env.AI_MODEL || "llama3-8b-8192";

// init clients
let groqClient = null;
let openaiClient = null;

if (AI_PROVIDER === "groq") {
  groqClient = new Groq({ apiKey: GROQ_API_KEY });
  console.log("✅ Using Groq");
} else if (AI_PROVIDER === "openai") {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  console.log("✅ Using OpenAI");
} else {
  console.log("✅ Using OLLAMA");
}

function extractContent(r){
  if(!r) return "";
  if(r.choices && r.choices[0]?.message?.content) return r.choices[0].message.content;
  if(r.message?.content) return r.message.content;
  return JSON.stringify(r);
}

async function getAICompletion(messages, {model=GENERAL_MODEL,temperature=0.7,max_tokens=500}={}){
  if(AI_PROVIDER==="groq"){
    const resp = await groqClient.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens
    });
    return extractContent(resp).trim();
  }
  if(AI_PROVIDER==="openai"){
    const resp = await openaiClient.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });
    return extractContent(resp).trim();
  }

  // Ollama fallback
  const resp = await axios.post(`${OLLAMA_BASE_URL}/api/chat`,{
    model,
    messages,
    stream:false,
  });
  return extractContent(resp.data).trim();
}

async function checkAIService(){
  try{
    await getAICompletion([{role:"user",content:"test"}],{max_tokens:10});
    return {available:true,provider:AI_PROVIDER};
  }catch(e){
    return {available:false,provider:AI_PROVIDER,error:e.message};
  }
}

module.exports={
  getAICompletion,
  checkAIService,
  AI_PROVIDER,
  CHAT_MODEL,
  GENERAL_MODEL
};
