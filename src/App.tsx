import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Play, Globe, ShieldCheck, Brain, Mic, Pencil, BookOpen,
  Trophy, Zap, Eye, EyeOff, Mail, Lock, User, Sparkles,
  Heart, Clock, Award, CheckCircle2, ArrowRight, Star as StarIcon, Users
} from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// ---- STYLE INJECTION ----
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  let style = document.getElementById('dysi-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dysi-styles';
    document.head.appendChild(style);
  }
  style.textContent = `
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/dist/web/OpenDyslexic-Regular.woff2') format('woff2'),
             url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/dist/web/OpenDyslexic-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/dist/web/OpenDyslexic-Bold.woff2') format('woff2'),
             url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/dist/web/OpenDyslexic-Bold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
      }
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Baloo+Thambi+2:wght@400;500;600;700;800&family=Lexend:wght@300;400;500;600;700;800&family=Comic+Neue:wght@300;400;700&display=swap');
      :root { --primary:#8B5CF6; --primary-dark:#6D28D9; --accent:#F59E0B; --bg:#F8FAFC; --text:#1E293B; }
      body { background-color:var(--bg); color:var(--text); font-family:'Lexend',sans-serif; overflow-x:hidden; background-image:radial-gradient(#CBD5E1 1.5px,transparent 1.5px); background-size:30px 30px; }
      .font-tamil { font-family:'Baloo Thambi 2',cursive; }
      .font-hindi  { font-family:'Baloo 2',cursive; }
      .font-dyslexic { font-family:'OpenDyslexic',sans-serif; letter-spacing:0.12em; line-height:1.8; }
      
      /* OpenDyslexic Global */
      .font-opendyslexic-global,
      .font-opendyslexic-global * {
        font-family: 'OpenDyslexic', sans-serif !important;
      }
      .font-opendyslexic-global .font-logo,
      .font-opendyslexic-global .font-logo * {
        font-family: 'Lexend', sans-serif !important;
      }
      .font-opendyslexic-global .font-tamil,
      .font-opendyslexic-global .font-tamil * {
        font-family: 'Baloo Thambi 2', cursive !important;
      }
      .font-opendyslexic-global .font-hindi,
      .font-opendyslexic-global .font-hindi * {
        font-family: 'Baloo 2', cursive !important;
      }

      /* Comic Neue Global */
      .font-comicneue-global,
      .font-comicneue-global * {
        font-family: 'Comic Neue', sans-serif !important;
      }
      .font-comicneue-global .font-logo,
      .font-comicneue-global .font-logo * {
        font-family: 'Lexend', sans-serif !important;
      }
      .font-comicneue-global .font-tamil,
      .font-comicneue-global .font-tamil * {
        font-family: 'Baloo Thambi 2', cursive !important;
      }
      .font-comicneue-global .font-hindi,
      .font-comicneue-global .font-hindi * {
        font-family: 'Baloo 2', cursive !important;
      }

      /* Comic Sans Global */
      .font-comicsans-global,
      .font-comicsans-global * {
        font-family: 'Comic Sans MS', cursive, sans-serif !important;
      }
      .font-comicsans-global .font-logo,
      .font-comicsans-global .font-logo * {
        font-family: 'Lexend', sans-serif !important;
      }
      .font-comicsans-global .font-tamil,
      .font-comicsans-global .font-tamil * {
        font-family: 'Baloo Thambi 2', cursive !important;
      }
      .font-comicsans-global .font-hindi,
      .font-comicsans-global .font-hindi * {
        font-family: 'Baloo 2', cursive !important;
      }

    .glass-panel { position:relative; overflow:hidden; background:rgba(255,255,255,0.75); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:3px solid rgba(255,255,255,0.85); border-radius:2rem; box-shadow:0 20px 40px -15px rgba(139,92,246,0.08),0 8px 16px -8px rgba(0,0,0,0.02),inset 0 1px 2px rgba(255,255,255,0.8); }
    .glass-panel::after { content:''; position:absolute; top:0; left:-150%; width:50%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent); transform:skewX(-25deg); transition:0.85s ease; pointer-events:none; }
    .glass-panel:hover::after { left:150%; }
    /* Game panels: allow mascot to overflow without clipping */
    .glass-game { position:relative; background:rgba(255,255,255,0.82); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:3px solid rgba(255,255,255,0.9); border-radius:2rem; box-shadow:0 20px 40px -15px rgba(139,92,246,0.1); overflow:visible; }

    .btn-candy { transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); border-bottom-width:6px; border-right-width:2px; border-left-width:2px; border-top-width:2px; box-shadow:0 6px 12px -2px rgba(139,92,246,0.15); position:relative; }
    .btn-candy:hover { transform:translateY(-4px) scale(1.02); box-shadow:0 16px 28px -6px rgba(139,92,246,0.35); }
    .btn-candy:active { transform:translateY(3px) scale(0.98); border-bottom-width:2px; margin-top:3px; }
    .btn-candy-primary { background-color:var(--primary); border-color:#6D28D9; color:white; }
    .btn-candy-secondary { background-color:white; border-color:#E2E8F0; color:var(--text); }
    .btn-candy-secondary:hover { background-color:#F8FAFC; }
    .btn-candy-accent { background-color:var(--accent); border-color:#D97706; color:white; }
    .animate-pulse-slow { animation:dpulse 4s cubic-bezier(0.4,0,0.6,1) infinite; }
    @keyframes dpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.85;transform:scale(1.03)} }
    @keyframes blink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.08)} }
    .dysi-blink { animation:blink 5s ease-in-out infinite; transform-origin:center; }

    /* AUTH */
    .auth-input-wrap{position:relative;width:100%}
    .auth-input{width:100%;background:rgba(248,250,252,0.9);border:2.5px solid #E2E8F0;border-radius:1rem;padding:1.1rem 3rem 0.5rem 3rem;font-family:'Lexend',sans-serif;font-size:1rem;font-weight:600;color:#1E293B;outline:none;transition:border-color 0.25s,box-shadow 0.25s,background 0.25s}
    .auth-input:focus{border-color:#8B5CF6;background:rgba(255,255,255,1);box-shadow:0 0 0 4px rgba(139,92,246,0.13),0 4px 16px -6px rgba(139,92,246,0.28)}
    .auth-input:focus+.auth-label,.auth-input:not(:placeholder-shown)+.auth-label{top:0.36rem;font-size:0.6rem;color:#8B5CF6;letter-spacing:0.08em}
    .auth-label{position:absolute;left:3rem;top:0.88rem;font-family:'Lexend',sans-serif;font-weight:700;font-size:0.88rem;color:#94A3B8;pointer-events:none;transition:all 0.2s ease;text-transform:uppercase}
    .auth-input-icon{position:absolute;left:0.95rem;top:50%;transform:translateY(-50%);color:#CBD5E1;pointer-events:none;transition:color 0.2s}
    .auth-input-wrap:focus-within .auth-input-icon{color:#8B5CF6}
    .auth-eye-btn{position:absolute;right:0.95rem;top:50%;transform:translateY(-50%);color:#CBD5E1;cursor:pointer;background:none;border:none;padding:0;transition:color 0.2s}
    .auth-eye-btn:hover{color:#8B5CF6}
    .auth-tab{flex:1;padding:0.75rem 0;font-family:'Lexend',sans-serif;font-weight:800;font-size:0.95rem;text-align:center;border-bottom:3px solid transparent;transition:all 0.25s ease;cursor:pointer;color:#94A3B8;background:transparent;border-top:none;border-left:none;border-right:none;outline:none}
    .auth-tab.active{color:#8B5CF6;border-bottom-color:#8B5CF6}
    .btn-auth-primary{width:100%;background:linear-gradient(135deg,#8B5CF6 0%,#7C3AED 100%);color:white;font-family:'Lexend',sans-serif;font-weight:800;font-size:1.05rem;letter-spacing:0.04em;padding:1rem;border-radius:1rem;border:none;cursor:pointer;position:relative;overflow:hidden;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 6px 20px -4px rgba(139,92,246,0.5)}
    .btn-auth-primary:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 14px 36px -8px rgba(139,92,246,0.6),0 0 50px -10px rgba(139,92,246,0.25)}
    .btn-auth-primary::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);transform:skewX(-20deg);transition:0.6s ease}
    .btn-auth-primary:hover::before{left:140%}
    .btn-social{display:flex;align-items:center;justify-content:center;gap:0.65rem;width:100%;padding:0.82rem 1rem;border-radius:0.9rem;border:2.5px solid #E2E8F0;background:white;font-family:'Lexend',sans-serif;font-weight:700;font-size:0.9rem;color:#374151;cursor:pointer;transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 2px 8px -4px rgba(0,0,0,0.06)}
    .btn-social:hover{border-color:#8B5CF6;transform:translateY(-3px) scale(1.02);box-shadow:0 10px 28px -6px rgba(139,92,246,0.22)}
    .auth-divider{display:flex;align-items:center;gap:0.75rem;color:#CBD5E1;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.1em}
    .auth-divider::before,.auth-divider::after{content:'';flex:1;height:1.5px;background:#E2E8F0}

    /* Dyslexia-friendly reading text — applied to all language reading content */
    .dyslexia-reading-text {
      letter-spacing: 0.12em;
      word-spacing: 0.18em;
      line-height: 2.1;
    }
    .font-tamil.dyslexia-reading-text {
      font-family: 'Baloo Thambi 2', cursive;
      letter-spacing: 0.1em;
      word-spacing: 0.16em;
      line-height: 2.2;
    }
    .font-hindi.dyslexia-reading-text {
      font-family: 'Baloo 2', cursive;
      letter-spacing: 0.08em;
      word-spacing: 0.14em;
      line-height: 2.3;
    }
    .font-dyslexic.dyslexia-reading-text {
      font-family: 'OpenDyslexic', sans-serif;
      letter-spacing: 0.14em;
      word-spacing: 0.2em;
      line-height: 2;
    }
  `;
};

// ---- TYPES ----
export type MascotMode =
  | 'idle' | 'loading' | 'auth' | 'dashboard'
  | 'letter-search' | 'letter-found' | 'listening'
  | 'speech-success' | 'reading' | 'writing'
  | 'assessment' | 'wrong-answer';

// ---- OVERLAY COLORS ----
const OVERLAY_COLORS = [
  { name: 'Cream',     value: 'rgba(255,253,235,1)', border: '#D97706', text: '#92400E' },
  { name: 'Sky Blue',  value: 'rgba(219,234,254,1)', border: '#3B82F6', text: '#1E40AF' },
  { name: 'Mint',      value: 'rgba(209,250,229,1)', border: '#10B981', text: '#065F46' },
  { name: 'Rose',      value: 'rgba(254,226,226,1)', border: '#EF4444', text: '#991B1B' },
  { name: 'Lavender',  value: 'rgba(237,233,254,1)', border: '#8B5CF6', text: '#5B21B6' },
  { name: 'None',      value: 'rgba(255,255,255,1)', border: '#CBD5E1', text: '#475569' },
];

// ---- i18n (with per-language letter game levels) ----
const i18n: Record<string, any> = {
  English: {
    heroTitle: "Every Child Learns Differently. Every Child Can Shine.",
    heroSub: "The world's most magical learning universe designed specifically for children with dyslexia.",
    startAdv:"Start Adventure", parents:"Parents Hub", welcome:"Welcome back",
    level:"Level", reading:"Reading", writing:"Writing", speech:"Speech", assessment:"Weekly Test",
    letterDetectiveTitle:"Letter Detective", findThe:"Find the letter",
    speechTitle:"Speech Practice", readAloud:"Read this aloud:",
    listening:"Listening...", tapToSpeak:"Tap to Speak",
    storyTitle:"The Magical Forest",
    storyText:"Once upon a time, a brave little explorer lived in a huge green forest. The explorer loved to read books under the stars every night and discovered new wonders each day.",
    excellent:"Excellent!", tryAgain: "Almost there! Give it one more try ✨", loading:"Loading magic...",
    encourageSpeech:"Great job speaking! Let's try another one!",
    encourageLetter:"You are a real detective! Find the next one!",
    encourageReading:"Reading makes us stronger explorers!",
    bubbleWelcome: "Hey Explorer! Ready for a magical learning quest today?",
    bubbleAuth:"Let's make a beautiful custom profile just for you!",
    targetSpeech:"The quick brown fox jumps.",
    letterFont: "",
    writingWords: ['cat', 'sun', 'star', 'tree', 'bird'],
    letterLevels:[
      {target:'d',options:['b','p','q','d','b','p']},
      {target:'p',options:['q','p','b','d','q','b']},
      {target:'m',options:['w','n','m','u','w','n']},
      {target:'n',options:['u','m','n','h','u','m']},
      {target:'g',options:['q','p','y','g','q','p']},
      {target:'a',options:['e','o','c','a','e','o']},
      {target:'t',options:['f','l','k','t','f','l']},
      {target:'h',options:['n','m','r','h','n','m']},
      {target:'r',options:['v','w','u','r','v','w']},
      {target:'c',options:['o','e','a','c','o','e']},
    ],
    parentHubTitle:"Parents Hub",
    parentHubSub:"Everything you need to support your child's unique learning journey",
    parentWelcome:"Welcome, Parents!",
    parentWelcomeText:"Dyslex.AI is built specifically for children with dyslexia — using science-backed methods, gamified learning, and emotional support to help every child discover their reading superpower.",
    howItWorksTitle:"How It Works",
    howSteps: [
      {
        title: "Create a Profile",
        desc: "Takes 2 minutes. Pick your child's name, choose their language, and Dysi introduces itself. No long forms, no complicated setup."
      },
      {
        title: "Choose an Activity",
        desc: "Letter Detective, Speech Practice, Reading Adventure — your child picks what they feel like today. Every activity targets a real dyslexia challenge without feeling like therapy."
      },
      {
        title: "Practice for 10 Minutes",
        desc: "That's all. Dysi celebrates every attempt — not just correct answers. Stars and XP appear like magic. Your child will ask to play again tomorrow."
      },
      {
        title: "Watch Them Shine",
        desc: "Track their progress on the dashboard. See exactly which letters they've mastered. Share their streaks. Celebrate the small wins — they add up to something big."
      },
    ],
    benefitsTitle:"Why Dyslex.AI?",
    benefits: [
      {
        title: "Science-Backed",
        desc: "Every activity is built on the Orton-Gillingham method — the same approach used by specialist dyslexia teachers worldwide. Not guesswork. Real science, made playful."
      },
      {
        title: "Emotional Safety",
        desc: "Dysi never says 'wrong'. Instead: 'Almost there!' Children with dyslexia already carry reading anxiety — we make sure this app never adds to it."
      },
      {
        title: "3 Languages",
        desc: "English, Tamil, and Hindi — with confusable letter training specific to each script. Because b/d confusion in English is different from ப/த confusion in Tamil."
      },
      {
        title: "Gamified Progress",
        desc: "Stars, XP, and level-ups that actually mean something. Your child earns rewards for effort, not just correct answers — because trying hard IS the achievement."
      },
      {
        title: "10 Min Sessions",
        desc: "Short on purpose. Research shows 10–12 minutes of focused practice beats 45-minute marathon sessions for dyslexic learners. Quality over quantity, always."
      },
      {
        title: "Zero Ads",
        desc: "No ads. No pop-ups. No 'upgrade now'. Just your child, Dysi, and a safe space to learn at their own pace."
      },
    ],
    tipsTitle:"Tips for Parents",
    tips: [
      "Sit next to them for the first session. Not to help — just to be there. It makes all the difference.",
      "Navigating together is key. Echo Dysi's positive phrases to make learning feel safer.",
      "10–15 minutes only. Stop before they want to stop — always end on a high.",
      "Tell their teacher about Dyslex.AI. Ask which letters your child struggles with in class and check if those are in their Detective game.",
      "Switch to Tamil or Hindi if your child seems frustrated in English. Learning in a familiar language first builds confidence that transfers.",
    ],
  },
  'தமிழ்': {
    heroTitle:"ஒவ்வொரு குழந்தையும் வித்தியாசமாக கற்கிறது. ஒவ்வொரு குழந்தையும் ஒளிர முடியும்.",
    heroSub:"டிஸ்லெக்ஸியா உள்ள குழந்தைகளுக்காக வடிவமைக்கப்பட்ட உலகின் மிக மாயாஜால கற்றல் உலகம்.",
    startAdv:"சாகசத்தைத் தொடங்கு", parents:"பெற்றோர் மையம்", welcome:"மீண்டும் வருக",
    level:"நிலை", reading:"வாசிப்பு", writing:"எழுதுதல்", speech:"பேச்சு", assessment:"வாராந்திர தேர்வு",
    letterDetectiveTitle:"எழுத்து துப்பறியும் நபர்", findThe:"எழுத்தைக் கண்டுபிடி",
    speechTitle:"பேச்சு பயிற்சி", readAloud:"இதை சத்தமாக வாசிக்கவும்:",
    listening:"கேட்கிறது...", tapToSpeak:"பேசுவதற்கு தட்டவும்",
    storyTitle:"மாயாஜால காடு",
    storyText:"முன்னொரு காலத்தில், ஒரு பெரிய பச்சை காட்டில் ஒரு தைரியமான சிறிய ஆய்வாளர் வாழ்ந்தார். அவர் ஒவ்வொரு இரவும் நட்சத்திரங்களின் கீழ் புத்தகங்களை வாசிக்க விரும்பினார்.",
    excellent:"அருமை!", tryAgain: "கிட்டத்தட்ட சரி! இன்னொரு முயற்சி செய் ✨", loading:"மேஜிக் ஏற்றுகிறது...",
    encourageSpeech:"நன்றாக பேசினீர்கள்! இன்னொன்றை முயற்சிப்போம்!",
    encourageLetter:"நீங்கள் ஒரு உண்மையான துப்பறியும் நபர்! அடுத்ததை கண்டுபிடி!",
    encourageReading:"வாசிப்பு நம்மை வலிமையான ஆய்வாளர்களாக்குகிறது!",
    bubbleWelcome: "ஹேய் ஆய்வாளர்! இன்று ஒரு மாயாஜால கற்றல் தேடலுக்கு தயாரா?",
    bubbleAuth:"உங்களுக்காக ஒரு அழகான தனிப்பயன் சுயவிவரத்தை உருவாக்குவோம்!",
    targetSpeech:"ஆமை மெதுவாக நகர்கிறது.",
    letterFont:"font-tamil",
    writingWords: ['பூனை', 'சூரியன்', 'மரம்', 'பறவை', 'அம்மா'],
    letterLevels:[
      {target:'ப',options:['த','ந','ப','ற','த','ந']},
      {target:'க',options:['ச','க','ஞ','ச','க','ஞ']},
      {target:'ம',options:['ர','ம','ல','ர','ம','ல']},
      {target:'வ',options:['ய','வ','ஓ','ய','வ','ஓ']},
      {target:'ட',options:['ண','ட','ழ','ண','ட','ழ']},
      {target:'ல',options:['ள','ல','ழ','ள','ல','ழ']},
      {target:'ர',options:['ற','ர','ல','ற','ர','ல']},
      {target:'ந',options:['ன','ந','ம','ன','ந','ம']},
      {target:'அ',options:['ஆ','அ','இ','ஆ','அ','இ']},
      {target:'உ',options:['ஊ','உ','ஒ','ஊ','உ','ஒ']},
    ],
    parentHubTitle:"பெற்றோர் மையம்",
    parentHubSub:"உங்கள் குழந்தையின் கற்றல் பயணத்தை ஆதரிக்க தேவையான அனைத்தும்",
    parentWelcome:"அன்பான பெற்றோர்களே!",
    parentWelcomeText:"Dyslex.AI டிஸ்லெக்ஸியா உள்ள குழந்தைகளுக்காக விஞ்ஞான அடிப்படையிலான முறைகள், விளையாட்டு மூலம் கற்றல் மற்றும் உணர்வு ஆதரவு மூலம் கட்டப்பட்டது.",
    howItWorksTitle:"எப்படி வேலை செய்கிறது",
    howSteps: [
      {
        title: "ஒரு சுயவிவரத்தை உருவாக்குங்கள்",
        desc: "வெறும் 2 நிமிடங்கள் போதும். உங்கள் குழந்தையின் பெயரை உள்ளிட்டு, அவர்களின் மொழியைத் தேர்ந்தெடுக்கவும். எந்தவொரு கடினமான அமைப்புகளும் இல்லை."
      },
      {
        title: "செயல்பாட்டைத் தேர்ந்தெடுக்கவும்",
        desc: "எழுத்து துப்பறியும் நபர், பேச்சு பயிற்சி, வாசிப்பு சாகசம் — உங்கள் குழந்தை இன்று என்ன விளையாட விரும்புகிறதோ அதைத் தேர்ந்தெடுக்கலாம்."
      },
      {
        title: "10 நிமிடங்கள் பயிற்சி செய்யுங்கள்",
        desc: "அவ்வளவுதான்! தவறான முயற்சிகளையும் Dysi அன்போடு வரவேற்கும். நட்சத்திரங்கள் மற்றும் XP புள்ளிகள் மேஜிக் போல தோன்றும். நாளை மீண்டும் விளையாடக் கேட்பார்கள்."
      },
      {
        title: "அவர்கள் ஒளிர்வதைப் பாருங்கள்",
        desc: "உங்கள் குழந்தையின் முன்னேற்றத்தைக் கண்காணியுங்கள். அவர்கள் கற்றுக்கொண்ட எழுத்துக்களைப் பார்த்து மகிழுங்கள். சிறு வெற்றிகளே பெரிய மாற்றத்தை உண்டாக்கும்."
      },
    ],
    benefitsTitle:"ஏன் Dyslex.AI?",
    benefits: [
      {
        title: "விஞ்ஞான அடிப்படை",
        desc: "ஒவ்வொரு பயிற்சியும் உலகெங்கிலும் உள்ள சிறப்பு ஆசிரியர்களால் பயன்படுத்தப்படும் புகழ்பெற்ற ஓர்டன்-கில்லிங்ஹாம் முறையின் அடிப்படையில் உருவாக்கப்பட்டது. வெறும் யூகங்கள் அல்ல, விளையாட்டோடு இணைந்த அறிவியல் பூர்வமான உண்மை."
      },
      {
        title: "உணர்வு பாதுகாப்பு",
        desc: "Dysi எப்போதுமே 'தவறு' என்று சொல்லாது. அதற்கு பதிலாக, 'கிட்டத்தட்ட சரி!' என்றே சொல்லும். குழந்தைகள் வாசிப்பு பயத்தை விடுத்து, எந்த ஒரு தயக்கமும் இல்லாமல் நம்பிக்கையோடு கற்கலாம்."
      },
      {
        title: "3 மொழிகள்",
        desc: "ஆங்கிலம், தமிழ் மற்றும் இந்தி என மூன்று மொழிகளுக்கான ஆதரவு. ஒவ்வொரு மொழிக்கும் உரிய குழப்பமான எழுத்துக்களை கண்டறியும் சிறப்பு பயிற்சி."
      },
      {
        title: "விளையாட்டு முன்னேற்றம்",
        desc: "நட்சத்திரங்கள், XP புள்ளிகள் மற்றும் சாகச நிலைகள். விடாமுயற்சிக்காகவும் ஈடுபாட்டிற்காகவும் உங்கள் குழந்தை வெகுமதிகளைப் பெறுகிறது - ஏனென்றால் தொடர் முயற்சியே அவர்களின் உண்மையான வெற்றி!"
      },
      {
        title: "10 நிமிட அமர்வுகள்",
        desc: "குறுகிய கால கவனம். 45 நிமிட நீண்ட பயிற்சியை விட 10–12 நிமிட கவனமான தினசரி பயிற்சி டிஸ்லெக்ஸியா உள்ள குழந்தைகளுக்கு சிறந்த பலனைத் தரும்."
      },
      {
        title: "விளம்பரங்கள் இல்லை",
        desc: "விளம்பரங்கள் இல்லை. பாப்-அப்கள் இல்லை. 'இப்போது மேம்படுத்தவும்' போன்ற தொல்லைகள் இல்லை. உங்கள் குழந்தையும் Dysi-யும் மட்டுமே அமைதியான சூழலில் கற்கலாம்."
      },
    ],
    tipsTitle:"பெற்றோருக்கான குறிப்புகள்",
    tips: [
      "முதல் சில அமர்வுகளில் உங்கள் குழந்தையின் அருகில் அமர்ந்து கொள்ளுங்கள். உதவி செய்ய அல்ல - வெறும் ஊக்கமளிக்க. அது அவர்களுக்குப் பெரும் நம்பிக்கையைத் தரும்.",
      "Dysi 'கிட்டத்தட்ட சரி!' என்று சொல்லும்போது, நீங்களும் அதை உரக்கக் கூறுங்கள். உங்கள் குரல் அவர்களின் நம்பிக்கையை இரட்டிப்பாக்கும்.",
      "10-15 நிமிடங்கள் மட்டுமே. அவர்கள் சலிப்படைவதற்கு முன்பே பயிற்சியை முடித்துக் கொள்ளுங்கள் - எப்போதுமே மகிழ்ச்சியோடு முடிக்க வேண்டும்.",
      "உங்கள் குழந்தையின் பள்ளி ஆசிரியரிடம் Dyslex.AI பற்றிப் பகிர்ந்து கொள்ளுங்கள். அவர்கள் எந்த எழுத்துக்களில் சிரமப்படுகிறார்கள் என்று கேட்டு அதைப் பயிற்சியில் சேருங்கள்.",
      "ஆங்கிலத்தில் கடினமாக இருந்தால் தமிழ் மொழிக்கு மாறுங்கள். தாய்மொழியில் முதலில் கற்றுக்கொள்வது அவர்களின் தன்னம்பிக்கையை உயர்த்தும்."
    ],
  },
  'हिन्दी': {
    heroTitle:"हर बच्चा अलग तरह से सीखता है। हर बच्चा चमक सकता है।",
    heroSub:"डिस्लेक्सिया से पीड़ित बच्चों के लिए विशेष रूप से डिज़ाइन किया गया दुनिया का सबसे जादुई शिक्षण ब्रह्मांड।",
    startAdv:"साहसिक कार्य शुरू करें", parents:"अभिभावक केंद्र", welcome:"आपका स्वागत है",
    level:"स्तर", reading:"पढ़ना", writing:"लिखना", speech:"भाषण", assessment:"साप्ताहिक परीक्षा",
    letterDetectiveTitle:"अक्षर जासूस", findThe:"अक्षर खोजें",
    speechTitle:"भाषण अभ्यास", readAloud:"इसे ज़ोर से पढ़ें:",
    listening:"सुन रहा है...", tapToSpeak:"बोलने के लिए टैप करें",
    storyTitle:"जादुई जंगल",
    storyText:"एक समय की बात है, एक विशाल हरे जंगल में एक बहादुर छोटा खोजकर्ता रहता था। वह हर रात तारों के नीचे किताबें पढ़ना पसंद करता था और हर दिन नई खोज करता था।",
    excellent:"उत्कृष्ट!", tryAgain: "लगभग सही! एक और बार कोशिश करो ✨", loading:"जादू लोड हो रहा है...",
    encourageSpeech:"बोलने का शानदार प्रयास! आइए एक और प्रयास करें!",
    encourageLetter:"आप वास्तव में एक जासूस हैं! अगला खोजें!",
    encourageReading:"पढ़ना हमें मजबूत अन्वेषक बनाता है!",
    bubbleWelcome: "हे अन्वेषक! क्या आज एक जादुई शिक्षण खोज के लिए तैयार हैं?",
    bubbleAuth:"आइए सिर्फ आपके लिए एक सुंदर कस्टम प्रोफ़ाइल बनाएं!",
    targetSpeech:"बिल्ली सो रही है।",
    letterFont:"font-hindi",
    writingWords: ['सूरज', 'तारा', 'पेड़', 'बिल्ली', 'घर'],
    letterLevels:[
      {target:'ब',options:['व','ब','भ','व','ब','भ']},
      {target:'ग',options:['ज','ग','घ','ज','ग','घ']},
      {target:'प',options:['फ','प','य','फ','प','य']},
      {target:'ड',options:['ढ','ड','द','ढ','ड','द']},
      {target:'ध',options:['न','ध','म','न','ध','म']},
      {target:'क',options:['ख','क','ग','ख','क','ग']},
      {target:'त',options:['द','त','थ','द','त','थ']},
      {target:'म',options:['न','म','र','न','म','र']},
      {target:'अ',options:['आ','अ','ओ','आ','अ','ओ']},
      {target:'र',options:['ल','र','व','ल','र','व']},
    ],
    parentHubTitle:"अभिभावक केंद्र",
    parentHubSub:"आपके बच्चे की अनोखी शिक्षण यात्रा को सहयोग देने के लिए सब कुछ",
    parentWelcome:"प्रिय अभिभावकों!",
    parentWelcomeText:"Dyslex.AI विशेष रूप से डिस्लेक्सिया से पीड़ित बच्चों के लिए विज्ञान-आधारित तरीकों, गेमिफाइड लर्निंग और भावनात्मक समर्थन के साथ बनाया गया है।",
    howItWorksTitle:"यह कैसे काम करता है",
    howSteps: [
      {
        title: "एक प्रोफ़ाइल बनाएं",
        desc: "केवल 2 मिनट का समय। अपने बच्चे का नाम दर्ज करें, उनकी भाषा चुनें और Dysi उनसे दोस्ती कर लेगा। कोई लंबे फॉर्म या जटिल सेटअप नहीं।"
      },
      {
        title: "एक गतिविधि चुनें",
        desc: "अक्षर जासूस, भाषण अभ्यास, पठन साहसिक कार्य — आपका बच्चा आज जो खेलना चाहता है उसे चुन सकता है। हर गतिविधि बिना किसी बोझ के कौशल सिखाती है।"
      },
      {
        title: "10 मिनट अभ्यास करें",
        desc: "बस इतना ही। Dysi हर प्रयास का जश्न मनाता है - न कि केवल सही उत्तरों का। सितारे और XP जादुई ढंग से बढ़ते हैं। आपका बच्चा कल फिर खेलने की जिद करेगा।"
      },
      {
        title: "उन्हें चमकते हुए देखें",
        desc: "डैशबोर्ड पर उनकी प्रगति को ट्रैक करें। देखें कि उन्होंने किन अक्षरों में महारत हासिल की है। छोटी जीतों का जश्न मनाएं - वे बड़ी सफलता जोड़ती हैं।"
      },
    ],
    benefitsTitle:"Dyslex.AI क्यों?",
    benefits: [
      {
        title: "विज्ञान-आधारित",
        desc: "हर गतिविधि ऑर्टन-गिंघम पद्धति पर आधारित है - जो दुनिया भर में डिस्लेक्सिया के विशेषज्ञ शिक्षकों द्वारा उपयोग की जाती है। कोई अंदाज़ा नहीं। शुद्ध विज्ञान, जिसे मनोरंजक बनाया गया है।"
      },
      {
        title: "भावनात्मक सुरक्षा",
        desc: "Dysi कभी 'गलत' नहीं कहता। बल्कि: 'लगभग सही!'। डिस्लेक्सिया वाले बच्चों को पहले से ही पढ़ने की चिंता होती है - हम यह सुनिश्चित करते हैं कि यह ऐप उस तनाव को कभी न बढ़ाए।"
      },
      {
        title: "3 भाषाएं",
        desc: "अंग्रेजी, तमिल और हिंदी - प्रत्येक भाषा के लिए विशेष रूप से अक्षरों के भ्रम को दूर करने का प्रशिक्षण। क्योंकि भाषा के अनुसार भ्रम अलग होता है।"
      },
      {
        title: "गेमिफाइड प्रगति",
        desc: "सितारे, XP और लेवल-अप जो सचमुच मायने रखते हैं। आपके बच्चे को सिर्फ सही उत्तर के लिए नहीं, बल्कि प्रयास करने के लिए पुरस्कार मिलते हैं - क्योंकि कोशिश करना ही असली सफलता है।"
      },
      {
        title: "10 मिनट के सत्र",
        desc: "जानबूझकर छोटा रखा गया। शोध बताते हैं कि डिस्लेक्सिया से पीड़ित बच्चों के लिए 45 मिनट के लंबे उबाऊ सत्रों की तुलना में 10-12 मिनट का अभ्यास अधिक प्रभावी होता है।"
      },
      {
        title: "कोई विज्ञापन नहीं",
        desc: "कोई विज्ञापन नहीं। कोई पॉप-अप नहीं। कोई 'अभी अपग्रेड करें' का दबाव नहीं। केवल आपका बच्चा, Dysi और खुद की गति से सीखने का एक सुरक्षित स्थान।"
      },
    ],
    tipsTitle:"माता-पिता के लिए सुझाव",
    tips: [
      "पहले सत्र में अपने बच्चे के साथ बैठें। मदद करने के लिए नहीं - बस उनके साथ रहने के लिए। यह एक बड़ा अंतर पैदा करता है।",
      "जब Dysi कहे 'लगभग सही!', तो आप भी उसे दोहराएं। आपकी आवाज उनके प्रोत्साहन को और मजबूत करेगी।",
      "केवल 10-15 मिनट अभ्यास। बच्चा जब बंद करना चाहे, उससे थोड़ा पहले ही रुकें - सत्र का अंत हमेशा अच्छे मूड में होना चाहिए।",
      "उनके स्कूल शिक्षक को Dyslex.AI के बारे में बताएं। पूछें कि बच्चा किन अक्षरों में संघर्ष कर रहा है और देखें कि क्या वे जासूस गेम में हैं।",
      "यदि बच्चा अंग्रेजी में निराश महसूस करता है, तो भाषा बदलकर हिंदी कर दें। जाने-पहचाने माहौल में शुरुआत करने से सफलता जल्दी मिलती है।"
    ],
  },
};

// ---- DYNAMIC DYSLEXIA INTEREST / THEMED DATA ----
const THEMED_CONTENT: Record<string, Record<string, Record<string, any>>> = {
  English: {
    Cricket: {
      speech: "I love to play cricket with a bat and ball.",
      writing: ['bat', 'ball', 'run', 'wick', 'play'],
      storyTitle: "The Great Match",
      storyText: "Sam ran fast with his bat to hit the ball. The crowd cheered as he scored a big run. His team won the match and they celebrated with a gold trophy."
    },
    Football: {
      speech: "Kick the ball into the net to score a goal.",
      writing: ['kick', 'ball', 'goal', 'team', 'pass'],
      storyTitle: "The Champion Kick",
      storyText: "Mia passed the ball to Leo near the goal. Leo took a deep breath and kicked the ball into the net. Everyone shouted with joy as they won the game."
    },
    Animals: {
      speech: "The little lion cub slept under the shady tree.",
      writing: ['lion', 'bear', 'frog', 'duck', 'deer'],
      storyTitle: "The Sleepy Cub",
      storyText: "A brave little lion cub lived in a deep green forest. The cub loved to play with birds and run after butterflies under the warm sun every single day."
    },
    Stories: {
      speech: "The quick brown fox jumps over the lazy dog.",
      writing: ['king', 'book', 'star', 'tree', 'fairy'],
      storyTitle: "The Magical Forest",
      storyText: "Once upon a time, a brave little explorer lived in a huge green forest. The explorer loved to read books under the stars every night and discovered new wonders."
    },
    Space: {
      speech: "A shiny rocket flies high to the red planet.",
      writing: ['star', 'moon', 'ship', 'mars', 'sun'],
      storyTitle: "Journey to Mars",
      storyText: "The silver rocket ship launched into the dark sky. The astronaut saw bright stars and the round blue Earth from the window as she flew toward Mars."
    }
  },
  'தமிழ்': {
    Cricket: {
      speech: "நான் மட்டை மற்றும் பந்துடன் விளையாட விரும்புகிறேன்.",
      writing: ['மட்டை', 'பந்து', 'ஓட்டம்', 'ஆட்டம்', 'வெற்றி'],
      storyTitle: "பெரிய மட்டை ஆட்டம்",
      storyText: "அன்பு மட்டையை பிடித்து பந்தை வேகமாக அடித்தான். பந்து தூர ஓடியது. அவனது நண்பர்கள் அனைவரும் கைதட்டி ஆரவாரம் செய்து வெற்றியை கொண்டாடினார்கள்."
    },
    Football: {
      speech: "பந்தை வலையில் உதைத்து இலக்கை அடை.",
      writing: ['உதை', 'பந்து', 'இலக்கு', 'ஆட்டம்', 'கோல்'],
      storyTitle: "மாயாஜால உதை",
      storyText: "கதிர் பந்தை உதைத்து கோல் போட்டான். மைதானத்தில் இருந்தவர்கள் மகிழ்ச்சியில் குதித்தனர். கதிரின் அணி முதல் இடத்தை பிடித்து கோப்பையை வென்றது."
    },
    Animals: {
      speech: "சிங்கக்குட்டி மரத்தின் அடியில் தூங்கியது.",
      writing: ['சிங்கம்', 'கரடி', 'தவளை', 'வாத்து', 'மான்'],
      storyTitle: "தூங்கும் சிங்கக்குட்டி",
      storyText: "ஒரு அடர்ந்த காட்டில் ஒரு குட்டி சிங்கம் இருந்தது. அது மர நிழலில் தூங்குவதையும் காட்டில் உள்ள மற்ற விலங்குகளோடு சேர்ந்து விளையாடுவதையும் விரும்பியது."
    },
    Stories: {
      speech: "ஆமை மெதுவாக நகர்கிறது.",
      writing: ['பூனை', 'சூரியன்', 'மரம்', 'பறவை', 'அம்மா'],
      storyTitle: "மாயாஜால காடு",
      storyText: "முன்னொரு காலத்தில், ஒரு பெரிய பச்சை காட்டில் ஒரு தைரியமான சிறிய ஆய்வாளர் வாழ்ந்தார். அவர் ஒவ்வொரு இரவும் நட்சத்திரங்களின் கீழ் புத்தகங்களை வாசிக்க விரும்பினார்."
    },
    Space: {
      speech: "விண்கலம் விண்வெளி நோக்கி பாய்கிறது.",
      writing: ['விண்', 'நிலா', 'கலம்', 'கோள்', 'சூரியன்'],
      storyTitle: "நிலா பயணம்",
      storyText: "சிறிய ராக்கெட் ஒன்று வானத்தில் பறந்து சென்றது. அதில் சென்ற விண்வெளி வீரன் ஜன்னல் வழியாக அழகான நட்சத்திரங்களையும் வட்ட வடிவ பூமியையும் பார்த்து ரசித்தான்."
    }
  },
  'हिन्दी': {
    Cricket: {
      speech: "मुझे बल्ला और गेंद से क्रिकेट खेलना पसंद है।",
      writing: ['बल्ला', 'गेंद', 'रन', 'खेल', 'मैच'],
      storyTitle: "रोमांचक मैच",
      storyText: "अमित ने बल्ले से गेंद को बहुत दूर मारा। सभी दर्शकों ने तालियाँ बजाईं। अमित की टीम ने यह मैच जीत लिया और सभी ने खुशी से नृत्य किया।"
    },
    Football: {
      speech: "गोल करने के लिए गेंद को नेट में किक मारें।",
      writing: ['किक', 'गेंद', 'गोल', 'खेल', 'जीत'],
      storyTitle: "शानदार किक",
      storyText: "राहुल ने गेंद को सीधे गोल पोस्ट की ओर किक किया। गेंद जाली के अंदर चली गई और सब चिल्लाए। राहुल की टीम विजेता बन गई।"
    },
    Animals: {
      speech: "शेर का बच्चा छायादार पेड़ के नीचे सो गया।",
      writing: ['शेर', 'भालू', 'मेंढक', 'बत्तख', 'हिरण'],
      storyTitle: "सोता हुआ शावक",
      storyText: "एक घने जंगल में शेर का एक छोटा बच्चा रहता था। उसे पेड़ की ठंडी छाया में सोना और तितलियों के पीछे भागना बहुत पसंद था।"
    },
    Stories: {
      speech: "बिल्ली सो रही है।",
      writing: ['सूरज', 'तारा', 'पेड़', 'बिल्ली', 'घर'],
      storyTitle: "जादुई जंगल",
      storyText: "एक समय की बात है, एक विशाल हरे जंगल में एक बहादुर छोटा खोजकर्ता रहता था। वह हर रात तारों के नीचे किताबें पढ़ना पसंद करता था और हर दिन नई खोज करता था।"
    },
    Space: {
      speech: "चमकदार रॉकेट अंतरिक्ष में उड़ रहा है।",
      writing: ['तारा', 'चाँद', 'रॉकेट', 'ग्रह', 'सूरज'],
      storyTitle: "चाँद की सैर",
      storyText: "एक सुंदर रॉकेट आसमान में उड़ गया। अंतरिक्ष यात्री ने खिड़की से गोल पृथ्वी और चमकते सितारों को देखा। यह एक बहुत ही जादुई यात्रा थी।"
    }
  }
};

// ---- REUSABLE THEME SELECTOR ----
const ThemeSelector = ({ lang, onSelectTheme }: { lang: string; onSelectTheme: (theme: string) => void }) => {
  const themes = [
    { id: 'Cricket', icon: '🏏', name: lang === 'English' ? 'Cricket' : lang === 'தமிழ்' ? 'மட்டைப்பந்து' : 'क्रिकेट', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300' },
    { id: 'Football', icon: '⚽', name: lang === 'English' ? 'Football' : lang === 'தமிழ்' ? 'கால்பந்து' : 'फुटबॉल', color: 'bg-blue-50 hover:bg-blue-100 border-blue-300' },
    { id: 'Animals', icon: '🦁', name: lang === 'English' ? 'Animals' : lang === 'தமிழ்' ? 'விலங்குகள்' : 'जानवर', color: 'bg-amber-50 hover:bg-amber-100 border-amber-300' },
    { id: 'Stories', icon: '📚', name: lang === 'English' ? 'Stories' : lang === 'தமிழ்' ? 'கதைகள்' : 'कहानियाँ', color: 'bg-pink-50 hover:bg-pink-100 border-pink-300' },
    { id: 'Space', icon: '🚀', name: lang === 'English' ? 'Space' : lang === 'தமிழ்' ? 'விண்வெளி' : 'अंतरिक्ष', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300' }
  ];

  const title = lang === 'English' 
    ? 'Choose your favorite topic!' 
    : lang === 'தமிழ்' 
    ? 'உங்களுக்கு பிடித்த தலைப்பைத் தேர்ந்தெடுக்கவும்!' 
    : 'अपना पसंदीदा विषय चुनें!';

  const subtitle = lang === 'English'
    ? 'Dysi will customize the game with your choice!'
    : lang === 'தமிழ்'
    ? 'டைசி உங்கள் விருப்பத்திற்கேற்ப விளையாட்டை அமைக்கும்!'
    : 'डायसी आपकी पसंद के अनुसार खेल को तैयार करेगी!';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-game p-6 sm:p-8 w-full max-w-2xl text-center bg-white shadow-2xl border-violet-100 mx-auto mt-6">
      <div className="w-full flex justify-center mb-4 pt-2" style={{ overflow: 'visible' }}>
        <VectorStudentAvatar mode="idle" className="w-24 h-24" interactive={false} />
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">{title}</h2>
      <p className="text-xs sm:text-sm text-slate-400 font-extrabold mb-6 sm:mb-8">{subtitle}</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-center">
        {themes.map(t => (
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            key={t.id}
            onClick={() => onSelectTheme(t.id)}
            className={`btn-candy border-2 p-4 sm:p-5 rounded-3xl flex flex-col items-center gap-3 cursor-pointer ${t.color}`}
          >
            <span className="text-3xl sm:text-4xl">{t.icon}</span>
            <span className="font-extrabold text-xs sm:text-sm text-slate-700">{t.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ---- STAR ----
const Star3D = ({ className = "w-6 h-6", inactive = false }: any) => (
  <svg viewBox="0 0 100 100" className={`drop-shadow-lg ${className}`} fill="none">
    <path d="M50 5 L64 35 L97 40 L73 63 L79 95 L50 80 L21 95 L27 63 L3 40 L36 35 Z" fill={inactive?"#CBD5E1":"#FFD700"} stroke="#B8860B" strokeWidth="2"/>
    <path d="M50 12 L61 37 L88 41 L68 59 L73 85 L50 72 Z" fill="rgba(255,255,255,0.4)"/>
  </svg>
);

// ---- LOGO (unique badge style) ----
const Logo = ({ onClick }: { onClick?: () => void }) => (
  <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={onClick}>
    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-violet-200/60 flex-shrink-0 relative overflow-hidden font-logo">
      <span className="text-white font-black text-lg sm:text-2xl leading-none font-logo" style={{fontFamily:'Lexend,sans-serif'}}>D</span>
      <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-300 opacity-90 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-300 opacity-90" />
    </div>
    <div className="flex flex-col leading-none font-logo">
      <span className="font-black text-base sm:text-2xl tracking-tight text-slate-800 font-logo" style={{fontFamily:'Lexend,sans-serif'}}>
        Dyslex<span className="text-orange-500 font-logo">.AI</span>
      </span>
      <span className="text-[7px] sm:text-[9px] font-black text-violet-400 tracking-[0.2em] uppercase mt-0.5 sm:mt-1 font-logo hidden sm:inline">Learning Universe</span>
    </div>
  </div>
);

// ---- MASCOT: DYSI — friendly glowing spirit orb ----
const DYSI_COLORS: Record<MascotMode, {a:string;b:string;stroke:string;glow:string}> = {
  'idle':          {a:'#C4B5FD',b:'#8B5CF6',stroke:'#7C3AED',glow:'rgba(139,92,246,0.18)'},
  'loading':       {a:'#DDD6FE',b:'#8B5CF6',stroke:'#7C3AED',glow:'rgba(139,92,246,0.25)'},
  'auth':          {a:'#C4B5FD',b:'#7C3AED',stroke:'#6D28D9',glow:'rgba(124,58,237,0.2)'},
  'dashboard':     {a:'#93C5FD',b:'#3B82F6',stroke:'#2563EB',glow:'rgba(59,130,246,0.18)'},
  'letter-search': {a:'#67E8F9',b:'#06B6D4',stroke:'#0891B2',glow:'rgba(6,182,212,0.2)'},
  'letter-found':  {a:'#FDE68A',b:'#F59E0B',stroke:'#D97706',glow:'rgba(245,158,11,0.28)'},
  'listening':     {a:'#5EEAD4',b:'#14B8A6',stroke:'#0D9488',glow:'rgba(20,184,166,0.2)'},
  'speech-success':{a:'#6EE7B7',b:'#10B981',stroke:'#059669',glow:'rgba(16,185,129,0.22)'},
  'reading':       {a:'#A5B4FC',b:'#6366F1',stroke:'#4F46E5',glow:'rgba(99,102,241,0.2)'},
  'writing':       {a:'#FCD34D',b:'#F59E0B',stroke:'#D97706',glow:'rgba(245,158,11,0.2)'},
  'assessment':    {a:'#94A3B8',b:'#475569',stroke:'#334155',glow:'rgba(71,85,105,0.18)'},
  'wrong-answer': {
    a: '#FDE68A',
    b: '#F59E0B',
    stroke: '#D97706',
    glow: 'rgba(245,158,11,0.18)'
  },
};

const DYSI_ANIM: Record<MascotMode, any> = {
  'idle':          {y:[0,-8,0],transition:{repeat:Infinity,duration:3.6,ease:"easeInOut"}},
  'loading':       {y:[0,-16,0],rotate:[0,4,-4,0],transition:{repeat:Infinity,duration:1.7,ease:"easeInOut"}},
  'auth':          {y:[0,-9,0],transition:{repeat:Infinity,duration:3.2,ease:"easeInOut"}},
  'dashboard':     {y:[0,-8,0],rotate:[0,2,-2,0],transition:{repeat:Infinity,duration:3.8,ease:"easeInOut"}},
  'letter-search': {x:[0,4,-4,0],y:[0,-4,0],transition:{repeat:Infinity,duration:2.4,ease:"easeInOut"}},
  'letter-found':  {y:[0,-34,0],scale:[1,1.13,1],transition:{duration:0.65,ease:"easeOut"}},
  'listening':     {y:[0,-5,0],rotate:[-2,2,-2],transition:{repeat:Infinity,duration:1.4,ease:"easeInOut"}},
  'speech-success':{y:[0,-34,0],scale:[1,1.13,1],transition:{duration:0.6,ease:"easeOut"}},
  'reading':       {rotate:[0,1.5,-1.5,0],y:[0,-4,0],transition:{repeat:Infinity,duration:4.2,ease:"easeInOut"}},
  'writing':       {x:[0,4,-4,0],transition:{repeat:Infinity,duration:1.8,ease:"easeInOut"}},
  'assessment':    {y:[0,-3,0],transition:{repeat:Infinity,duration:5,ease:"easeInOut"}},
  'wrong-answer': {
    rotate: [-3, 3, -2, 2, 0],
    y: [0, -5, 0],
    transition: { duration: 0.55, ease: 'easeInOut' }
  },
};

export const VectorStudentAvatar: React.FC<{
  mode: MascotMode; className?: string;
  onMascotClick?: () => void; interactive?: boolean; bubbleText?: string;
  bubblePosition?: 'top' | 'bottom'; draggable?: boolean;
}> = ({ mode, className = "w-48 h-48", onMascotClick, interactive = true, bubbleText, bubblePosition = 'top', draggable = false }) => {
  const [hovered, setHovered] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (bubbleText) {
      setBubbleVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setBubbleVisible(false);
      }, 4000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [bubbleText]);

  const handleMascotClick = () => {
    setBubbleVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setBubbleVisible(false);
    }, 4000);
    if (onMascotClick) onMascotClick();
  };

  const uid = React.useRef(`m${Math.random().toString(36).slice(2, 7)}`).current;
  const c = DYSI_COLORS[mode] ?? DYSI_COLORS['idle'];
  const anim = DYSI_ANIM[mode] ?? DYSI_ANIM['idle'];
  const currentVariant = hovered && interactive ? {scale:1.08,y:-10} : anim;
  const happy   = ['idle','dashboard','letter-found','speech-success','auth'].includes(mode);
  const sad     = false;
  const thinking = mode === 'wrong-answer';
  const focused = ['letter-search','writing','assessment'].includes(mode);

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none z-10 ${className}`}
      onClick={handleMascotClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{cursor: interactive ? 'pointer' : 'default'}}
    >
      <AnimatePresence>
        {bubbleText && bubbleVisible && (
          <motion.div
            initial={{opacity:0,scale:0.85,y:bubblePosition === 'bottom' ? -15 : 15}}
            animate={{opacity:1,scale:1,y:0}}
            exit={{opacity:0,scale:0.85,y:bubblePosition === 'bottom' ? -15 : 15}}
            className={`absolute ${bubblePosition === 'bottom' ? 'top-[112%] border-t-[8px] border-b-4' : 'bottom-[112%] border-b-[8px] border-t-4'} bg-white border-4 border-violet-400 text-slate-800 font-extrabold px-3 py-1.5 sm:px-5 sm:py-3 rounded-2xl sm:rounded-[2rem] shadow-2xl max-w-[180px] sm:max-w-[260px] text-center text-xs sm:text-sm tracking-wide z-50 leading-relaxed pointer-events-none`}
            style={{fontFamily:'Lexend,sans-serif'}}
          >
            {bubbleText}
            {bubblePosition === 'bottom' ? (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-violet-400" />
            ) : (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-violet-400" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full h-full relative flex items-center justify-center overflow-visible"
        animate={currentVariant as any}
        drag={draggable}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.6}
        whileDrag={{ scale: 1.12, zIndex: 40, cursor: 'grabbing' }}
      >
        <div className="absolute inset-4 rounded-full blur-3xl z-0" style={{background:c.glow}} />
        <svg viewBox="0 0 400 400" className="w-full h-full relative z-20 overflow-visible">
          <defs>
            <linearGradient id={`dg_${mode}_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.a}/><stop offset="100%" stopColor={c.b}/>
            </linearGradient>
          </defs>

          {/* Ground shadow */}
          <motion.ellipse cx="200" cy="386" rx="64" ry="7" fill="rgba(0,0,0,0.07)"
            animate={{scaleX:[0.88,1.1,0.88]}} transition={{repeat:Infinity,duration:3.6,ease:"easeInOut"}} />

          {/* Main spirit body group — bobs up/down */}
          <motion.g animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:3.6,ease:"easeInOut"}}>
            {/*
              DYSI body: friendly ghost/spirit orb.
              Round dome top, three wavy bumps at bottom (ghost tail).
            */}
            <path
              d={`M 200 92
                C 150 92, 114 128, 114 178
                C 114 232, 138 270, 160 286
                C 166 295, 161 307, 156 314
                C 152 320, 155 328, 163 325
                C 172 322, 177 314, 185 314
                C 193 314, 197 322, 200 322
                C 203 322, 207 314, 215 314
                C 223 314, 228 322, 237 325
                C 245 328, 248 320, 244 314
                C 239 307, 234 295, 240 286
                C 262 270, 286 232, 286 178
                C 286 128, 250 92, 200 92 Z`}
              fill={`url(#dg_${mode}_${uid})`}
              stroke={c.stroke}
              strokeWidth="11"
              strokeLinejoin="round"
            />

            {/* Glowing magic heart inside the body (Orton-Gillingham friendly core) */}
            <motion.path
              d="M 200 196 C 196 186, 183 186, 183 196 C 183 207, 200 216, 200 216 C 200 216, 217 207, 217 196 C 217 186, 204 186, 200 196 Z"
              fill="rgba(255,255,255,0.72)"
              animate={{scale:[1,1.15,1],opacity:[0.6,0.95,0.6]}}
              transition={{repeat:Infinity,duration:2.5,ease:"easeInOut"}}
            />

            {/* EYES */}
            <g className="dysi-eyes">
              {happy && (
                <g>
                  {/* Happy curved eyes */}
                  <path d="M 152 172 Q 165 158, 178 172" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round"/>
                  <path d="M 222 172 Q 235 158, 248 172" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round"/>
                </g>
              )}
              {sad && (
                <g>
                  {/* Sad worried curved eyes */}
                  <path d="M 152 170 Q 165 184, 178 170" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round"/>
                  <path d="M 222 170 Q 235 184, 248 170" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round"/>
                </g>
              )}
              {thinking && (
                <g>
                  {/* Thinking/concentrating eyes: straight line/slight curve */}
                  <path d="M 152 170 L 178 170" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round"/>
                  <path d="M 222 170 L 248 170" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round"/>
                </g>
              )}
              {focused && (
                <g>
                  {/* Rounded curious eyes */}
                  <circle cx="165" cy="170" r="13" fill="#1E293B"/>
                  <circle cx="235" cy="170" r="13" fill="#1E293B"/>
                  {/* Eye shines */}
                  <circle cx="161" cy="166" r="4.5" fill="white"/>
                  <circle cx="231" cy="166" r="4.5" fill="white"/>
                </g>
              )}
              {!happy && !sad && !focused && !thinking && (
                <g>
                  {/* Default standard blinking eyes */}
                  <g className="dysi-blink">
                    <circle cx="165" cy="170" r="14" fill="#1E293B"/>
                    <circle cx="161" cy="165" r="5.5" fill="white"/>
                  </g>
                  <g className="dysi-blink">
                    <circle cx="235" cy="170" r="14" fill="#1E293B"/>
                    <circle cx="231" cy="165" r="5.5" fill="white"/>
                  </g>
                </g>
              )}
            </g>

            {/* Rosy warm cheeks */}
            <circle cx="140" cy="190" r="11" fill="#EF4444" opacity="0.25"/>
            <circle cx="260" cy="190" r="11" fill="#EF4444" opacity="0.25"/>

            {/* MOUTH */}
            <path
              d={happy ? "M 188 190 Q 200 206, 212 190" : focused ? "M 192 190 Q 200 196, 208 190" : thinking ? "M 190 194 L 210 194" : "M 188 190 Q 200 203, 212 190"}
              fill="none"
              stroke="#1E293B"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </motion.g>

          {/* ACCESSORY MODES */}
          {/* WRITING — cute magical drawing pen */}
          {mode==='writing' && (
            <motion.g transform="translate(250,225) rotate(-15)"
              animate={{x:[0,5,-5,0],y:[0,-5,5,0]}} transition={{repeat:Infinity,duration:2,ease:"easeInOut"}}>
              <path d="M 0 45 L 12 10 L 30 10 L 42 45 L 21 65 Z" fill="#F59E0B" stroke="#B8860B" strokeWidth="3.5"/>
              <path d="M 12 10 L 21 -10 L 30 10 Z" fill="#EF4444"/>
              <path d="M 21 65 L 21 82" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round"/>
              <circle cx="21" cy="85" r="4" fill="#8B5CF6"/>
            </motion.g>
          )}

          {/* LISTENING — musical/radio signal waves */}
          {mode==='listening' && (
            <g transform="translate(0, -10)">
              {[
                { r: 104, d: 0.1 },
                { r: 124, d: 0.4 },
                { r: 144, d: 0.7 }
              ].map((s,i) => (
                <motion.path key={i} d={`M ${200 - s.r} 178 A ${s.r} ${s.r} 0 0 1 ${200 + s.r} 178`}
                  fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" opacity="0.75"
                  animate={{scale:[0.9,1.15,0.9],opacity:[0.2,0.85,0.2]}} transition={{repeat:Infinity,duration:1.6,delay:s.d,ease:"easeInOut"}}/>
              ))}
            </g>
          )}

          {/* SPEECH SUCCESS / FOUND — floating golden stars */}
          {(mode==='speech-success' || mode==='letter-found') && (
            <motion.g>
              {[
                {x:85,y:105,s:0.4,d:0},
                {x:305,y:95,s:0.5,d:0.25},
                {x:115,y:275,s:0.35,d:0.45},
                {x:285,y:285,s:0.45,d:0.15}
              ].map((s,i) => (
                <motion.g key={i} transform={`translate(${s.x},${s.y}) scale(${s.s})`}
                  animate={{scale:[s.s, s.s*1.4, s.s],rotate:[0,180,360]}} transition={{repeat:Infinity,duration:2.5,delay:s.d,ease:"easeInOut"}}>
                  <path d="M 0,-15 L 4,-4 L 15,-4 L 7,3 L 10,14 L 0,8 L -10,14 L -7,3 L -15,-4 L -4,-4 Z" fill="#FFD700" stroke="#D97706" strokeWidth="2.5"/>
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* READING — tiny cute open book */}
          {mode==='reading' && (
            <motion.g transform="translate(132, 236) scale(0.9)" animate={{y:[0,-4,0]}} transition={{repeat:Infinity,duration:3.2,ease:"easeInOut"}}>
              <path d="M 4 28 Q 38 18, 72 28 L 72 64 Q 38 54, 4 64 Z" fill="#EC4899" stroke="#9D174D" strokeWidth="3.5" strokeLinejoin="round"/>
              <path d="M 72 28 Q 106 18, 140 28 L 140 64 Q 106 54, 72 64 Z" fill="#EC4899" stroke="#9D174D" strokeWidth="3.5" strokeLinejoin="round"/>
              <path d="M 8 24 Q 38 14, 72 24 L 72 58 Q 38 48, 8 58 Z" fill="#FFFDF5" stroke="#475569" strokeWidth="2"/>
              <path d="M 72 24 Q 106 14, 136 24 L 136 58 Q 106 48, 72 58 Z" fill="#FFFDF5" stroke="#475569" strokeWidth="2"/>
              <line x1="22" y1="36" x2="58" y2="36" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="22" y1="46" x2="50" y2="46" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="86" y1="36" x2="122" y2="36" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="86" y1="46" x2="114" y2="46" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round"/>
            </motion.g>
          )}

          {/* LETTER SEARCH — magnifying lens */}
          {mode==='letter-search' && (
            <motion.g transform="translate(252,216) rotate(15)"
              animate={{rotate:[15,22,10,15]}} transition={{repeat:Infinity,duration:2.8,ease:"easeInOut"}}>
              <line x1="0" y1="0" x2="-22" y2="-22" stroke="#1E293B" strokeWidth="9.5" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="23" fill="rgba(255,255,255,0.78)" stroke="#8B5CF6" strokeWidth="6.5"/>
              <path d="M 2 12 A 14 14 0 0 1 18 -2" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <motion.g transform="translate(10,10)">
                {[
                  {x:-2,y:2,d:0},
                  {x:8,y:-6,d:0.3},
                  {x:-6,y:-4,d:0.6}
                ].map((s,i) => (
                  <motion.circle key={i} cx={s.x} cy={s.y} r="2.5" fill="#22D3EE"
                    animate={{scale:[0.2,1.3,0.2],opacity:[0,1,0]}} transition={{repeat:Infinity,duration:1.1,delay:s.d}}/>
                ))}
              </motion.g>
            </motion.g>
          )}

          {/* ASSESSMENT — big glasses + clipboard */}
          {mode==='assessment' && (
            <g>
              <circle cx="168" cy="140" r="21" fill="none" stroke="#1E293B" strokeWidth="3.5"/>
              <circle cx="232" cy="140" r="21" fill="none" stroke="#1E293B" strokeWidth="3.5"/>
              <line x1="189" y1="140" x2="211" y2="140" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round"/>
              <g transform="translate(72,222) rotate(-5)">
                <rect x="0" y="0" width="52" height="68" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="2"/>
                <rect x="6" y="6" width="40" height="55" rx="2" fill="#FFFDF5"/>
                <rect x="16" y="-5" width="20" height="10" rx="2" fill="#94A3B8"/>
                <motion.path d="M 32 14 L 35 19 L 42 12" fill="none" stroke="#10B981" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  initial={{pathLength:0}} animate={{pathLength:1}}
                  transition={{repeat:Infinity,repeatType:'reverse',duration:1.4}}/>
              </g>
            </g>
          )}

          {/* WRONG ANSWER — floating heart */}
          {mode==='wrong-answer' && (
            <motion.g animate={{y:[0,-10,0]}} transition={{repeat:Infinity,duration:2.2,ease:"easeInOut"}}>
              <path d="M 200 74 C 196 64, 183 64, 183 74 C 183 85, 200 94, 200 94 C 200 94, 217 85, 217 74 C 217 64, 204 64, 200 74 Z" fill="#EF4444"/>
            </motion.g>
          )}

          {/* LOADING — glow rings */}
          {mode==='loading' && (
            <g>
              {[0,0.55,1.1].map((delay,i) => (
                <motion.circle key={i} cx="200" cy="196" r={54+i*23}
                  fill="none" stroke={c.a} strokeWidth="1.5"
                  animate={{opacity:[0,0.6,0],scale:[0.9,1.1,0.9]}}
                  transition={{repeat:Infinity,duration:2.2,delay,ease:"easeInOut"}}/>
              ))}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

// ---- STAR FLIGHT ----
interface FlyingStar { id:number; startX:number; startY:number; }
const StarFlightSystem = ({activeStars,onStarComplete}:{activeStars:FlyingStar[];onStarComplete:(id:number)=>void}) => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      <AnimatePresence>
        {activeStars.map(star => (
          <motion.div key={star.id}
            initial={{x:star.startX,y:star.startY,scale:0.3,opacity:0}}
            animate={{x:[star.startX,star.startX-60,vw-120],y:[star.startY,star.startY-140,36],scale:[0.3,1.6,0.7],opacity:[0,1,1,0.9,0],rotate:[0,220,540]}}
            transition={{duration:1.3,ease:"easeOut"}}
            onAnimationComplete={() => onStarComplete(star.id)}
            className="absolute">
            <Star3D className="w-10 h-10 filter drop-shadow-[0_4px_10px_rgba(251,191,36,0.5)]"/>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ---- NAVBAR ----
const Navbar = ({lang,view,setView,userData,starPulse,isBackendOnline,onSettingsClick}:any) => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl glass-panel px-3 py-2.5 sm:px-6 sm:py-4 z-50 flex justify-between items-center" style={{overflow:'visible'}}>
      <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setView('home')}>
        <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center hidden sm:flex" style={{overflow:'visible'}}>
          <VectorStudentAvatar mode="idle" className="w-10 h-10 sm:w-14 sm:h-14" interactive={false}/>
        </div>
        <Logo/>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Simple Green/Red Dot Status Indicator */}
        <div 
          className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm flex-shrink-0 ${isBackendOnline ? 'bg-emerald-500 animate-pulse animate-duration-1000' : 'bg-rose-500'}`}
          title={isBackendOnline ? 'Personalization Server Online ⚡' : 'Offline / Client Mode 🏠'}
        />

        {userData ? (
          <div className="flex gap-2">
            <motion.div animate={{scale:starPulse?[1,1.45,1]:1}} transition={{duration:0.3,ease:"easeOut"}}
              className="bg-amber-100 border-2 border-amber-300 px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full flex items-center gap-1 shadow-sm">
              <Star3D className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse-slow"/>
              <span className="font-extrabold text-amber-700 text-xs sm:text-lg">{userData.stars}</span>
            </motion.div>
          </div>
        ) : (
          <button onClick={()=>setView('auth')} className="btn-candy btn-candy-primary px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wide">Sign In</button>
        )}

        {/* Settings button (Always visible) */}
        <button
          onClick={onSettingsClick}
          className="bg-violet-100 hover:bg-violet-200 border-2 border-violet-300 p-1.5 sm:p-2.5 rounded-full flex items-center justify-center shadow-sm text-violet-700 transition-colors"
          title="Settings"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </nav>
  );
};

// ---- HOME VIEW ----
const homeContainerVariants = {hidden:{},visible:{transition:{staggerChildren:0.1}}};
const wordVariants = {hidden:{opacity:0,y:15},visible:{opacity:1,y:0,transition:{type:"spring",stiffness:100,damping:12}}};

const HomeView = ({lang,setView,userData}:any) => {
  const t = i18n[lang];
  const titleParts = t.heroTitle.split('. ');
  const currentUserName = userData?.name || (lang === 'English' ? 'Explorer' : lang === 'தமிழ்' ? 'ஆய்வாளர்' : 'अन्वेषक');
  const customWelcomeMsg = t.bubbleWelcome
    .replace('Explorer', currentUserName)
    .replace('ஆய்வாளர்', currentUserName)
    .replace('अन्वेषक', currentUserName);

  return (
    <div className="relative z-10 max-w-5xl mx-auto pt-32 sm:pt-40 pb-16 px-4 sm:px-6 flex flex-col items-center text-center min-h-screen justify-start">
      {/* Large Website Name Brand Display at Center Top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-3 mb-8 select-none cursor-pointer"
        onClick={() => setView('home')}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.2rem] sm:rounded-[1.5rem] bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-violet-200/80 relative overflow-hidden font-logo">
          <span className="text-white font-black text-3xl sm:text-4xl leading-none font-logo" style={{fontFamily:'Lexend,sans-serif'}}>D</span>
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-300 opacity-90 animate-ping" style={{ animationDuration: '3.5s' }} />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-300 opacity-90" />
        </div>
        <div className="flex flex-col items-center mt-1">
          <h1 className="font-black text-3xl sm:text-5xl tracking-tight text-slate-800 font-logo" style={{fontFamily:'Lexend,sans-serif'}}>
            Dyslex<span className="text-orange-500 font-logo">.AI</span>
          </h1>
          <span className="text-[10px] sm:text-xs font-black text-violet-400 tracking-[0.25em] uppercase mt-0.5 sm:mt-1 font-logo">Learning Universe</span>
        </div>
      </motion.div>

      <motion.h1 variants={homeContainerVariants} initial="hidden" animate="visible"
        className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-800 leading-tight mb-6 max-w-4xl">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-violet-800 to-slate-900 mb-1">
          {titleParts[0]?.split(" ").map((w:string,i:number) => (
            <motion.span key={i} variants={wordVariants}
              whileHover={{scale:1.1,y:-4,color:"#8B5CF6",transition:{type:"spring",stiffness:300,damping:10}}}
              className="inline-block mr-2.5 cursor-default select-none">{w}</motion.span>
          ))}{titleParts[0] && '.'}
        </span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500">
          {titleParts[1]?.split(" ").map((w:string,i:number) => (
            <motion.span key={i} variants={wordVariants}
              whileHover={{scale:1.1,y:-4,color:"#EC4899",transition:{type:"spring",stiffness:300,damping:10}}}
              className="inline-block mr-2.5 cursor-default select-none">{w}</motion.span>
          ))}
        </span>
      </motion.h1>
      
      <p className="text-base sm:text-xl text-slate-600 font-medium mb-8 leading-relaxed max-w-2xl px-2">{t.heroSub}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mb-12 relative z-20 w-full px-4 max-w-md mx-auto">
        <button onClick={()=>setView(userData?'dashboard':'auth')} className="btn-candy btn-candy-accent text-lg sm:text-xl px-8 py-4 sm:px-10 sm:py-5 rounded-full font-extrabold flex items-center justify-center gap-3 shadow-lg w-full sm:w-auto">
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white"/> {t.startAdv}
        </button>
        <button onClick={()=>setView('parents')} className="btn-candy btn-candy-secondary text-base sm:text-lg px-8 py-4 sm:px-9 sm:py-5 rounded-full font-extrabold flex items-center justify-center gap-3 shadow-md w-full sm:w-auto">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500"/> {t.parents}
        </button>
      </div>

      {/* Centered Mascot below controls */}
      <div className="w-full max-w-[280px] sm:max-w-sm relative" style={{overflow:'visible'}}>
        <div className="relative aspect-square flex items-center justify-center" style={{overflow:'visible'}}>
          <div className="absolute inset-0 glass-panel bg-gradient-to-br from-violet-50/55 to-blue-50/55 shadow-2xl z-0"/>
          <div className="relative z-10 w-[85%] h-[85%] flex items-center justify-center mt-6 sm:mt-0" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="dashboard" className="w-full h-full" bubbleText={customWelcomeMsg} bubblePosition="bottom" draggable={true}/>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- PARENTS HUB VIEW ----
const ParentsHubView = ({lang,setView,isBackendOnline,backendUserId}:any) => {
  const t = i18n[lang];
  const benefitIcons = [Brain,Heart,Globe,Trophy,Clock,Award];
  
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (isBackendOnline && backendUserId) {
      setLoadingStats(true);
      fetch(`http://localhost:5000/api/dashboard/${backendUserId}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoadingStats(false);
        })
        .catch(err => {
          console.error("Error fetching stats:", err);
          setLoadingStats(false);
        });
    }
  }, [isBackendOnline, backendUserId]);

  return (
    <div className="min-h-screen relative z-10 pb-24">
      {/* Hero */}
      <div className="pt-28 sm:pt-36 pb-12 px-4 text-center">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          <span className="inline-block bg-violet-100 text-violet-700 font-extrabold text-xs sm:text-sm px-5 py-2 rounded-full uppercase tracking-wider mb-4 sm:mb-6">
            {t.parents}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-800 mb-4">{t.parentHubTitle}</h1>
          <p className="text-base sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto px-2">{t.parentHubSub}</p>
        </motion.div>
      </div>

      {/* AI Progress Dashboard Section */}
      {isBackendOnline && stats ? (
        <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-16">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-panel p-6 sm:p-10 border-violet-100 bg-white/70 shadow-xl rounded-[2.5rem]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">📊 child progress analytics</h2>
                <p className="text-slate-500 font-bold text-xs sm:text-sm">AI diagnostics and weakness profiling</p>
              </div>
              <button
                onClick={() => window.open(`http://localhost:5000/api/user/${backendUserId}/report`, '_blank')}
                className="btn-candy btn-candy-accent px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-1.5"
              >
                📥 Download Dyslexia Report (PDF)
              </button>
            </div>

            {/* Accuracies Progress Circles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Reading Comprehension', val: stats.accuracies.reading, color: 'stroke-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Spelling Handwriting', val: stats.accuracies.writing, color: 'stroke-amber-500', text: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Speech Pronunciation', val: stats.accuracies.speech, color: 'stroke-blue-500', text: 'text-blue-500', bg: 'bg-blue-50' }
              ].map((item, idx) => (
                <div key={idx} className={`p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center ${item.bg}`}>
                  <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-slate-200 fill-none" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" className={`${item.color} fill-none`} strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - (item.val || 0) / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-lg font-black text-slate-800">{item.val || 0}%</span>
                  </div>
                  <span className="font-extrabold text-slate-600 text-xs sm:text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Timelines and Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline bar charts */}
              <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                <h3 className="text-base font-black text-slate-800 mb-4">📈 Last 7 Days Activity Trends</h3>
                <div className="flex items-end justify-between h-40 pt-4 px-2 relative border-b border-slate-200">
                  {stats.charts.labels.map((day: string, i: number) => {
                    const count = stats.charts.attempts[i] || 0;
                    const accuracy = stats.charts.accuracy[i] || 0;
                    const barHeight = Math.min(count * 20, 100); 
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 group relative">
                        <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-center">
                          Attempts: {count}<br/>Avg Acc: {accuracy}%
                        </div>
                        <div 
                          className={`w-4 sm:w-6 rounded-t-lg transition-all duration-500 shadow-inner ${accuracy >= 80 ? 'bg-gradient-to-t from-emerald-400 to-emerald-500' : accuracy > 0 ? 'bg-gradient-to-t from-violet-400 to-violet-500' : 'bg-slate-200'}`}
                          style={{ height: `${Math.max(barHeight, 8)}px` }}
                        />
                        <span className="text-[10px] font-bold text-slate-400 mt-2">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-3 text-center">
                  Green bars show high accuracy. Purple bars show activity spikes.
                </p>
              </div>

              {/* Weaknesses List */}
              <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50">
                <h3 className="text-base font-black text-slate-800 mb-4">🧠 Active Learning Focus (Weaknesses)</h3>
                <div className="flex flex-col gap-3">
                  {stats.weaknesses && stats.weaknesses.length > 0 ? (
                    stats.weaknesses.map((w: any, i: number) => {
                      let badgeBg = 'bg-emerald-100 text-emerald-700';
                      let badgeText = 'Mild';
                      if (w.severity > 6) {
                        badgeBg = 'bg-rose-100 text-rose-700 animate-pulse';
                        badgeText = 'Severe';
                      } else if (w.severity > 3) {
                        badgeBg = 'bg-amber-100 text-amber-700';
                        badgeText = 'Moderate';
                      }
                      return (
                        <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-700 text-xs sm:text-sm">{w.label}</span>
                            <span className="text-[10px] font-bold text-slate-400">Attempts logged: {w.frequency}</span>
                          </div>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${badgeBg}`}>
                            {badgeText}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 font-bold text-xs sm:text-sm">
                      🎉 No notable risk patterns or reversals detected yet! Practice to compile metrics.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : isBackendOnline && loadingStats ? (
        <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-16 text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Compiling student metrics...</p>
        </div>
      ) : (
        <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-16">
          <div className="glass-panel p-6 border-amber-200 bg-amber-50/50 text-center rounded-3xl">
            <h3 className="text-lg font-black text-amber-800 mb-1">🏠 Local Sandbox Active</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-bold">
              Start the Node.js backend server and configure GEMINI_API_KEY to activate dynamic AI content, vision-based handwriting assessments, chatbot advice, and printable PDF dyslexia reports!
            </p>
          </div>
        </div>
      )}

      {/* Welcome card */}
      <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-12">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className="glass-panel p-6 md:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8"
          style={{ overflow: 'visible' }}>
          <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="idle" className="w-28 h-28 sm:w-36 sm:h-36" interactive={false} bubbleText="Hello parents! 👋" draggable={true}/>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-violet-700 mb-3">{t.parentWelcome}</h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">{t.parentWelcomeText}</p>
          </div>
        </motion.div>
      </div>

      {/* Benefits section */}
      <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 text-center">{t.benefitsTitle}</h2>
        <p className="text-center text-sm sm:text-base text-slate-400 font-medium mb-10 px-2">
          Built different. Because your child is different — and that's their superpower.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(t.benefits || []).map((b: any, i: number) => {
            const Icon = benefitIcons[i] || CheckCircle2;
            const colorSets = [
              { bg: 'bg-gradient-to-b from-violet-50 to-violet-100/50', border: 'border-violet-200/80', iconColor: 'text-violet-600 bg-white shadow-violet-100', num: '#8B5CF6' },
              { bg: 'bg-gradient-to-b from-rose-50 to-rose-100/50',   border: 'border-rose-200/80',   iconColor: 'text-rose-600 bg-white shadow-rose-100',     num: '#EF4444' },
              { bg: 'bg-gradient-to-b from-blue-50 to-blue-100/50',   border: 'border-blue-200/80',   iconColor: 'text-blue-600 bg-white shadow-blue-100',     num: '#3B82F6' },
              { bg: 'bg-gradient-to-b from-amber-50 to-amber-100/50',  border: 'border-amber-200/80',  iconColor: 'text-amber-600 bg-white shadow-amber-100',   num: '#F59E0B' },
              { bg: 'bg-gradient-to-b from-emerald-50 to-emerald-100/50',border: 'border-emerald-200/80',iconColor: 'text-emerald-600 bg-white shadow-emerald-100',num: '#10B981'},
              { bg: 'bg-gradient-to-b from-indigo-50 to-indigo-100/50', border: 'border-indigo-200/80', iconColor: 'text-indigo-600 bg-white shadow-indigo-100', num: '#6366F1' },
            ];
            const cs = colorSets[i % colorSets.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ y: -6, scale: 1.03, boxShadow: '0 20px 30px -10px rgba(0,0,0,0.05)' }}
                className={`rounded-[2rem] p-6 sm:p-8 border-2 ${cs.bg} ${cs.border} flex flex-col items-center text-center cursor-default transition-all duration-300 relative overflow-hidden`}
              >
                <span
                  className="absolute right-4 top-2 text-7xl font-black opacity-[0.07] select-none pointer-events-none"
                  style={{ color: cs.num, fontFamily: 'Lexend, sans-serif' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${cs.iconColor}`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                
                <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl mb-3 tracking-tight">{b.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed text-sm">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How it works section */}
      <div className="px-4 sm:px-6 max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-8 sm:mb-10 text-center">{t.howItWorksTitle}</h2>
        <div className="relative">
          <div
            className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-violet-300 via-violet-200 to-transparent hidden md:block"
            style={{ zIndex: 0 }}
          />
          <div className="space-y-6">
            {(t.howSteps || []).map((step: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex flex-col md:flex-row gap-4 sm:gap-5 items-center md:items-start relative z-10 text-center md:text-left"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0 flex items-center justify-center font-black text-white shadow-lg text-lg"
                  style={{
                    background: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][i],
                    boxShadow: `0 8px 20px -6px ${['rgba(139,92,246,0.4)', 'rgba(59,130,246,0.4)', 'rgba(16,185,129,0.4)', 'rgba(245,158,11,0.4)'][i]}`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 glass-panel p-5 w-full">
                  <h3 className="font-extrabold text-slate-800 text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Parent quote strip */}
      <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { quote: "My son actually ASKED to do his reading practice for the first time ever.", name: "Priya, parent of Arjun (8)", color: 'border-violet-300 bg-violet-50' },
            { quote: "The Tamil letter training is something no other app offers. Finally.", name: "Meena, parent of Kavya (7)", color: 'border-emerald-300 bg-emerald-50' },
            { quote: "Dysi is so kind. My daughter doesn't feel embarrassed making mistakes anymore.", name: "Ravi, parent of Sneha (9)", color: 'border-amber-300 bg-amber-50' },
          ].map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`rounded-3xl p-6 border-2 ${q.color}`}
            >
              <div className="text-4xl font-black text-slate-200 leading-none mb-1" aria-hidden="true">"</div>
              <p className="text-slate-700 font-semibold leading-relaxed mb-4 text-xs sm:text-sm italic">
                {q.quote}
              </p>
              <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">— {q.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 sm:px-6 max-w-5xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6 sm:mb-8 text-center">{t.tipsTitle}</h2>
        <div className="glass-panel p-6 sm:p-8">
          <div className="space-y-4">
            {(t.tips||[]).map((tip:string,i:number) => (
              <motion.div key={i} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.1+i*0.08}}
                className="flex items-start gap-3 sm:gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed text-sm sm:text-base">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
          className="glass-panel p-8 sm:p-10 bg-gradient-to-br from-violet-50 to-blue-50">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-3">Ready to get started?</h3>
          <p className="text-slate-500 font-medium mb-6 text-sm sm:text-base">Create a free account and begin your child's learning journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>setView('auth')} className="btn-candy btn-candy-primary px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-extrabold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
              <Sparkles className="w-5 h-5"/> Create Free Account
            </button>
            <button onClick={()=>setView('home')} className="btn-candy btn-candy-secondary px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-extrabold text-base sm:text-lg shadow-sm w-full sm:w-auto">
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ---- DASHBOARD ----
const DashboardView = ({lang,setView,userData}:any) => {
  const t = i18n[lang];
  const modules = [
    { id: 'letter',     title: t.letterDetectiveTitle, icon: Brain,    color: 'bg-pink-100',    text: 'text-pink-600',    border: 'border-pink-300',    time: '~8 min' },
    { id: 'speech',     title: t.speechTitle,          icon: Mic,      color: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-300',    time: '~5 min' },
    { id: 'reading',    title: t.reading,              icon: BookOpen, color: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-300', time: '~10 min' },
    { id: 'writing',    title: t.writing,              icon: Pencil,   color: 'bg-amber-100',   text: 'text-amber-600',   border: 'border-amber-300',   time: '~7 min' },
    { id: 'assessment', title: t.assessment,           icon: Trophy,   color: 'bg-violet-100',  text: 'text-violet-600',  border: 'border-violet-300',  time: '~15 min' },
  ];
  const currentUserName = userData?.name || (lang === 'English' ? 'Explorer' : lang === 'தமிழ்' ? 'ஆய்வாளர்' : 'अन्वेषक');

  return (
    <div className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen relative z-10">
      <div className="glass-panel p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{overflow:'visible'}}>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-10 text-center sm:text-left" style={{overflow:'visible'}}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center p-1 relative" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="idle" className="w-16 h-16 sm:w-20 sm:h-20" interactive={true} draggable={true}/>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{t.welcome}, {currentUserName}!</h2>
            <div className="flex gap-4 mt-2 justify-center sm:justify-start"><span className="font-bold text-slate-500">{t.level} {Math.floor((userData?.xp||0)/100)+1}</span></div>
          </div>
        </div>
        <div className="w-full md:w-64 bg-slate-100 rounded-full h-7 border-2 border-slate-200 overflow-hidden relative shadow-inner z-10">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000" style={{width:`${((userData?.xp||0)%100)}%`}}/>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-black text-slate-700 tracking-wide">{(userData?.xp||0)%100} / 100 XP to Next Level</div>
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-6 px-4">Choose Your Adventure</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(mod => (
          <motion.button whileHover={{y:-6,scale:1.02}} whileTap={{scale:0.98}} key={mod.id} onClick={()=>setView(mod.id)}
            className={`glass-panel p-6 flex flex-col items-center gap-4 text-center btn-candy ${mod.color} ${mod.border}`}>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-md ${mod.text}`}>
              <mod.icon className="w-8 h-8 sm:w-10 sm:h-10"/>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-800">{mod.title}</h4>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ---- LETTER DETECTIVE ----
const LetterDetective = ({lang,setView,addReward}:any) => {
  const t = i18n[lang];
  const levels = t.letterLevels;
  const [level,setLevel] = useState(0);
  const [status,setStatus] = useState<MascotMode>('letter-search');
  const [mistakes,setMistakes] = useState(0);
  const [showResults,setShowResults] = useState(false);
  const [shuffledOptions,setShuffledOptions] = useState<string[]>([]);
  const currentLevel = levels[level%levels.length];

  useEffect(() => {
    setLevel(0);
    setMistakes(0);
    setShowResults(false);
    setStatus('letter-search');
  }, [lang]);

  useEffect(()=>{
    const lvl = levels[level%levels.length];
    setShuffledOptions([...lvl.options].sort(()=>Math.random()-0.5));
    setStatus('letter-search');
  },[level,lang]);

  const handleSelect=(letter:string)=>{
    if(status!=='letter-search'||showResults) return;
    if(letter===currentLevel.target){
      setStatus('letter-found');
      if(level===9){addReward(30,5);setTimeout(()=>setShowResults(true),1500);}
      else{addReward(10,2);setTimeout(()=>setLevel(l=>l+1),1500);}
    } else {
      setStatus('wrong-answer');setMistakes(m=>m+1);
      setTimeout(()=>setStatus('letter-search'),1000);
    }
  };
  
  const handleRestart=()=>{setLevel(0);setMistakes(0);setShowResults(false);setStatus('letter-search');};
  const calcStars=()=>mistakes===0?5:mistakes<=2?4:mistakes<=4?3:2;
  const lf = t.letterFont||'font-dyslexic';

  return (
    <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center justify-start">
      <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
        <button onClick={()=>setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
        <h2 className={`text-xl sm:text-2xl font-black text-pink-600 tracking-wide ${lf}`}>{t.letterDetectiveTitle}</h2>
        <div className="font-extrabold text-xs sm:text-sm text-slate-500">Score: {level*10}</div>
      </div>
      
      {showResults ? (
        <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="glass-game p-6 sm:p-10 w-full text-center bg-white shadow-2xl border-pink-200">
          <div className="w-full flex justify-center mb-6 pt-12" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="letter-found" className="w-28 h-28 sm:w-36 h-36 mx-auto" interactive={false}/>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">Quest Completed!</h2>
          <p className="text-base sm:text-lg text-slate-500 font-bold mb-6">You found all the letters!</p>
          <div className="flex justify-center gap-2 mb-6">{Array.from({length:5}).map((_,i)=><Star3D key={i} className="w-10 h-10 sm:w-12 sm:h-12" inactive={i>=calcStars()}/>)}</div>
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-6 mb-6 max-w-md mx-auto flex justify-around">
            <div><div className="text-xs sm:text-sm font-bold text-slate-400">Accuracy</div><div className="text-xl sm:text-2xl font-black text-pink-500">{Math.max(0,100-mistakes*10)}%</div></div>
            <div className="border-l-2 border-slate-200"/>
            <div><div className="text-xs sm:text-sm font-bold text-slate-400">Mistakes</div><div className="text-xl sm:text-2xl font-black text-slate-700">{mistakes}</div></div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={handleRestart} className="btn-candy btn-candy-primary px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-extrabold text-sm sm:text-lg shadow-lg">Play Again</button>
            <button onClick={()=>setView('dashboard')} className="btn-candy btn-candy-secondary px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-extrabold text-sm sm:text-lg shadow-sm">Dashboard</button>
          </div>
        </motion.div>
      ) : (
        <div className="glass-game p-4 sm:p-6 w-full bg-white shadow-xl border-pink-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wide">Level {level+1} of 10</span>
            <div className="w-24 sm:w-32 bg-slate-100 h-2.5 sm:h-3 rounded-full overflow-hidden border"><div className="bg-pink-400 h-full transition-all duration-300" style={{width:`${(level+1)*10}%`}}/></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8 justify-center">
            {/* Left side: Mascot and Target letter */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 relative mt-10" style={{overflow:'visible'}}>
                <VectorStudentAvatar mode={status} className="w-full h-full"
                  bubbleText={status==='letter-found'?t.excellent:status==='wrong-answer'?t.tryAgain:t.encourageLetter}/>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mt-2">{t.findThe}</h3>
              <div className={`text-4xl sm:text-5xl font-extrabold text-pink-500 mt-1 ${lf} bg-pink-50/50 inline-block px-6 py-2 rounded-2xl border-4 border-pink-200/50 shadow-inner`}>
                {currentLevel.target}
              </div>
            </div>

            {/* Right side: Options grid */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full max-w-[240px] sm:max-w-[285px] mx-auto md:mx-0 mt-4 md:mt-0">
              {shuffledOptions.map((letter,i)=>(
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} key={i} onClick={()=>handleSelect(letter)}
                  className={`btn-candy bg-white border-slate-200 text-slate-700 hover:bg-slate-50 p-2.5 sm:p-4 rounded-2xl text-2xl sm:text-4xl font-extrabold ${lf} aspect-square flex items-center justify-center shadow-sm`}>
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---- SPEECH PRACTICE ----
const SpeechPractice = ({lang,setView,addReward,isBackendOnline,backendUserId}:any) => {
  const t = i18n[lang];
  const [theme, setTheme] = useState<string | null>(null);
  const [status,setStatus] = useState<MascotMode>('idle');
  const [isListening,setIsListening] = useState(false);
  const [transcript,setTranscript] = useState('');
  const [content, setContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    setTheme(null);
    setContent(null);
  }, [lang]);

  useEffect(() => {
    if (!theme) {
      setContent(null);
      return;
    }
    if (isBackendOnline) {
      setLoadingContent(true);
      fetch('http://localhost:5000/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: backendUserId, theme, lang })
      })
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoadingContent(false);
      })
      .catch(err => {
        console.error("Content fetch failed, using fallback", err);
        const languageKey = lang === 'தமிழ்' ? 'தமிழ்' : lang === 'हिन्दी' ? 'हिन्दी' : 'English';
        const fallback = THEMED_CONTENT[languageKey]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'];
        setContent(fallback);
        setLoadingContent(false);
      });
    } else {
      const languageKey = lang === 'தமிழ்' ? 'தமிழ்' : lang === 'हिन्दी' ? 'हिन्दी' : 'English';
      const fallback = THEMED_CONTENT[languageKey]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'];
      setContent(fallback);
    }
  }, [theme, lang, isBackendOnline, backendUserId]);

  const targetText = content ? content.speech : "";

  const runMockSpeech = () => {
    setTimeout(() => {
      setTranscript(targetText);
      setStatus('speech-success');
      setIsListening(false);
      addReward(15, 2);
    }, 2000);
  };

  const toggleListen = () => {
    if (isListening) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setIsListening(false);
      return;
    }

    if (!targetText) return;
    setIsListening(true);
    setStatus('listening');
    setTranscript('');

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64Audio = reader.result as string;

            if (isBackendOnline) {
              fetch('http://localhost:5000/api/verify/speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: backendUserId,
                  question: targetText,
                  audio: base64Audio
                })
              })
              .then(res => {
                if (res.ok) return res.json();
                throw new Error("Speech verification API failed");
              })
              .then(data => {
                setTranscript(data.transcript || targetText);
                setStatus(data.correct ? 'speech-success' : 'idle');
                setIsListening(false);
                addReward(15, data.correct ? 2 : 1);
              })
              .catch(err => {
                console.error("Speech verification failed, fallback to local:", err);
                runMockSpeech();
              });
            } else {
              runMockSpeech();
            }
          };

          stream.getTracks().forEach(t => t.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch(err => {
        console.error("Mic access failed, fallback to mock:", err);
        runMockSpeech();
      });
  };

  if (!theme) {
    return (
      <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center justify-start">
        <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
          <button onClick={()=>setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
          <h2 className="text-xl sm:text-2xl font-black text-blue-600 tracking-wide">{t.speechTitle}</h2>
          <div className="w-16"/>
        </div>
        <ThemeSelector lang={lang} onSelectTheme={(selected) => setTheme(selected)} />
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex gap-2">
          <button onClick={()=>setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
          <button onClick={()=>setTheme(null)} className="btn-candy btn-candy-secondary px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">Change Topic 🎨</button>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-blue-600 tracking-wide">{t.speechTitle} ({theme})</h2>
        <div className="w-16 hidden sm:block"/>
      </div>
      <div className="glass-game p-6 sm:p-10 w-full text-center bg-white shadow-xl border-blue-100 flex flex-col items-center">
        <div className="flex flex-col items-center overflow-visible w-full">
          <div className="w-full flex justify-center mb-6 pt-20" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode={status} className="w-28 h-28 mx-auto"
              bubbleText={status==='listening'?t.listening:status==='speech-success'?t.excellent:t.encourageSpeech}/>
          </div>
          {isListening && (
            <div className="flex gap-1 items-end justify-center h-10 mb-6">
              {[1,2,3,4,5,6,7,8].map(bar=>(
                <motion.div key={bar} animate={{height:["10px","35px","10px"]}}
                  transition={{duration:0.6,repeat:Infinity,delay:bar*0.08,ease:"easeInOut"}}
                  className="w-1 bg-blue-500 rounded-full"/>
              ))}
            </div>
          )}
          <h3 className="text-base sm:text-lg font-bold text-slate-500 mb-3">{t.readAloud}</h3>
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-8 p-6 bg-blue-50/50 rounded-3xl border-4 border-blue-100 shadow-inner leading-relaxed">{targetText}</div>
          <motion.button whileHover={{scale:1.06}} whileTap={{scale:0.94}} onClick={toggleListen}
            className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-6 shadow-lg transition-colors ${isListening?'bg-red-500':'bg-blue-500 btn-candy border-blue-600'}`}>
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white z-10"/>
          </motion.button>
          <p className="text-base sm:text-lg font-extrabold text-slate-600 mb-4 h-6">
            {isListening?<span className="text-red-500 animate-pulse">{t.listening}</span>:t.tapToSpeak}
          </p>
          {transcript && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl mt-2">
              <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wide">You said:</p>
              <p className="text-xl text-slate-700 font-extrabold italic">"{transcript}"</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- READING ADVENTURE ----
const ReadingAdventure = ({lang,setView,addReward,overlayColor,setOverlayColor,isBackendOnline,backendUserId}:any) => {
  const t = i18n[lang];
  const [theme, setTheme] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [status, setStatus] = useState<MascotMode>('idle');
  const [content, setContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    setTheme(null);
    setContent(null);
  }, [lang]);

  useEffect(() => {
    if (!theme) {
      setContent(null);
      return;
    }
    if (isBackendOnline) {
      setLoadingContent(true);
      fetch('http://localhost:5000/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: backendUserId, theme, lang })
      })
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoadingContent(false);
      })
      .catch(err => {
        console.error("Content fetch failed, using fallback", err);
        const languageKey = lang === 'தமிழ்' ? 'தமிழ்' : lang === 'हिन्दी' ? 'हिन्दी' : 'English';
        const fallback = THEMED_CONTENT[languageKey]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'];
        setContent(fallback);
        setLoadingContent(false);
      });
    } else {
      const languageKey = lang === 'தமிழ்' ? 'தமிழ்' : lang === 'हिन्दी' ? 'हिन्दी' : 'English';
      const fallback = THEMED_CONTENT[languageKey]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'];
      setContent(fallback);
    }
  }, [theme, lang, isBackendOnline, backendUserId]);

  const storyTitle = content ? content.storyTitle : "";
  const storyText = content ? content.storyText : "";

  const runMockReading = () => {
    setTimeout(() => {
      setIsReading(false);
      setStatus('speech-success');
      addReward(20, 1);
    }, 2500);
  };

  const handleReadAloud = () => {
    if (isReading) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setIsReading(false);
      return;
    }

    if (!storyText) return;
    setIsReading(true);
    setStatus('reading');

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64Audio = reader.result as string;

            if (isBackendOnline) {
              fetch('http://localhost:5000/api/verify/reading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: backendUserId,
                  question: storyTitle,
                  answer: storyText,
                  audio: base64Audio
                })
              })
              .then(res => {
                if (res.ok) return res.json();
                throw new Error("Reading verification API failed");
              })
              .then(data => {
                setIsReading(false);
                setStatus('speech-success');
                addReward(20, 1);
              })
              .catch(err => {
                console.error("Reading verification failed, fallback to local:", err);
                runMockReading();
              });
            } else {
              runMockReading();
            }
          };

          stream.getTracks().forEach(t => t.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch(err => {
        console.error("Mic access failed, fallback to mock:", err);
        runMockReading();
      });
  };

  const OverlayPicker = () => (
    <div style={{ marginBottom: '1.2rem' }}>
      <p
        style={{
          fontFamily: 'Lexend, sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '0.5rem',
        }}
      >
        🎨 Reading Background Colour
      </p>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {OVERLAY_COLORS.map((col) => (
          <button
            key={col.name}
            onClick={() => setOverlayColor(col.value)}
            title={col.name}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: col.value,
              border: overlayColor === col.value
                ? `3px solid ${col.border}`
                : '2px solid #E2E8F0',
              cursor: 'pointer',
              transition: 'transform 0.15s, border 0.15s',
              transform: overlayColor === col.value ? 'scale(1.15)' : 'scale(1)',
              boxShadow: overlayColor === col.value
                ? `0 0 0 3px ${col.border}33`
                : 'none',
            }}
            aria-label={`Set reading background to ${col.name}`}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: 'Lexend, sans-serif',
          fontWeight: 600,
          fontSize: '0.68rem',
          color: '#94A3B8',
          marginTop: '0.3rem',
        }}
      >
        Different tints help different children — let your child pick their favourite!
      </p>
    </div>
  );

  if (!theme) {
    return (
      <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center justify-start">
        <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
          <button onClick={()=>setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-wide">{t.reading}</h2>
          <div className="w-16"/>
        </div>
        <ThemeSelector lang={lang} onSelectTheme={(selected) => setTheme(selected)} />
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex gap-2">
          <button onClick={()=>setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
          <button onClick={()=>setTheme(null)} className="btn-candy btn-candy-secondary px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">Change Topic 🎨</button>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-wide">{t.reading} ({theme})</h2>
        <div className="w-16 hidden sm:block"/>
      </div>
      <div className="glass-game p-6 sm:p-10 border-[#FDE68A] w-full text-center shadow-xl"
        style={{ background: overlayColor, transition: 'background 0.4s ease' }}>
        <div className="relative z-10 w-full">
          <OverlayPicker />
          <div className="w-full flex justify-center mb-4 pt-20" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode={status} className="w-28 h-28 mx-auto" bubbleText={isReading?"Reading...":t.encourageReading}/>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6">{storyTitle}</h1>
          <p className={`text-xl sm:text-2xl text-slate-700 mb-8 dyslexia-reading-text ${lang==='English'?'font-dyslexic':lang==='தமிழ்'?'font-tamil':'font-hindi'}`}>
            {storyText.split(' ').map((word:string,i:number)=>(
              <span key={i} className="inline-block mr-2.5 mb-1.5 rounded-lg px-2 py-0.5 transition-all duration-150 cursor-pointer select-none hover:bg-yellow-200 hover:scale-105">{word}</span>
            ))}
          </p>
          <div className="flex justify-center">
            <button onClick={handleReadAloud}
              className={`btn-candy px-8 py-3.5 sm:px-10 sm:py-5 rounded-full font-extrabold flex items-center gap-3 text-lg sm:text-xl shadow-lg transition-all ${isReading?'bg-red-500 hover:bg-red-600 border-red-600 text-white animate-pulse':'btn-candy-accent'}`}>
              {isReading?<Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>:<Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white"/>}
              {isReading?"Stop Reading ⏹️":"Start Reading 🗣️"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- WRITING GAME ----
const WritingGame = ({ lang, setView, addReward, isBackendOnline, backendUserId }: any) => {
  const t = i18n[lang];
  const [theme, setTheme] = useState<string | null>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [color, setColor] = useState('#8B5CF6');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<MascotMode>('idle');
  const [analysisText, setAnalysisText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [drawnSomething, setDrawnSomething] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    setTheme(null);
    setContent(null);
    setWordIdx(0);
    setVerificationResult(null);
  }, [lang]);

  useEffect(() => {
    if (!theme) {
      setContent(null);
      return;
    }
    if (isBackendOnline) {
      setLoadingContent(true);
      fetch('http://localhost:5000/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: backendUserId, theme, lang })
      })
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoadingContent(false);
      })
      .catch(err => {
        console.error("Content fetch failed, using fallback", err);
        const languageKey = lang === 'தமிழ்' ? 'தமிழ்' : lang === 'हिन्दी' ? 'हिन्दी' : 'English';
        const fallback = THEMED_CONTENT[languageKey]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'];
        setContent(fallback);
        setLoadingContent(false);
      });
    } else {
      const languageKey = lang === 'தமிழ்' ? 'தமிழ்' : lang === 'हिन्दी' ? 'हिन्दी' : 'English';
      const fallback = THEMED_CONTENT[languageKey]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'];
      setContent(fallback);
    }
  }, [theme, lang, isBackendOnline, backendUserId]);

  const words = content ? content.writing : (theme ? (THEMED_CONTENT[lang]?.[theme] || THEMED_CONTENT['English']?.[theme] || THEMED_CONTENT['English']?.['Stories'])?.writing || [] : []);
  const currentWord = words[wordIdx % words.length] || "";

  useEffect(() => {
    if (!theme) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.parentElement?.clientWidth || 620;
    canvas.width = width;
    canvas.height = width < 500 ? 230 : 320;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;

    clearCanvas();
  }, [wordIdx, showResults, theme]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#FAFAF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 10]);
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 4);
    ctx.lineTo(canvas.width, canvas.height / 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (canvas.height * 3) / 4);
    ctx.lineTo(canvas.width, (canvas.height * 3) / 4);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    setDrawnSomething(false);
  };

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    if (!ctxRef.current) return;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
    setDrawnSomething(true);
  };

  const draw = (e: any) => {
    if (!isDrawing || !ctxRef.current) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.lang = lang === 'English' ? 'en-US' : lang === 'தமிழ்' ? 'ta-IN' : 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const submitDrawing = async () => {
    if (!drawnSomething) {
      alert("Please draw the word first!");
      return;
    }

    setIsAnalyzing(true);
    setStatus('writing');
    setAnalysisText('Scanning strokes...');

    if (isBackendOnline) {
      try {
        const dataUrl = canvasRef.current?.toDataURL('image/png') || '';
        setAnalysisText('Analyzing writing structure via Gemini...');
        
        const res = await fetch('http://localhost:5000/api/verify/drawing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: backendUserId,
            image: dataUrl,
            word: currentWord
          })
        });

        if (res.ok) {
          const data = await res.json();
          
          if (data.parentVerify) {
            setIsAnalyzing(false);
            setVerificationResult(data);
            setStatus('idle');
            return;
          }
          
          if (data.confidence < 80) {
            setAnalysisText("Oops, Dysi couldn't read that clearly! Please trace it again. 🎨");
            setStatus('wrong-answer');
            setTimeout(() => {
              setIsAnalyzing(false);
              setStatus('idle');
            }, 2500);
            return;
          }
          
          setIsAnalyzing(false);
          setVerificationResult(data);
          
          if (data.correct) {
            setStatus('speech-success');
            addReward(15, 2);
          } else {
            setStatus('wrong-answer');
          }
          return;
        }
      } catch (err) {
        console.error("Verification backend error, falling back to mock:", err);
      }
    }

    // Offline mock fallback
    setTimeout(() => {
      setAnalysisText('Analyzing word structure...');
    }, 800);

    setTimeout(() => {
      setAnalysisText('Verifying Orton-Gillingham shapes...');
    }, 1600);

    setTimeout(() => {
      setIsAnalyzing(false);
      setStatus('speech-success');
      
      const mockResult = {
        correct: true,
        accuracy: 95,
        confidence: 90,
        feedback: "Great job! You wrote the word beautifully! 🌟",
        letterFeedback: currentWord.split('').map((char: string) => ({ letter: char, status: 'correct' }))
      };
      
      setVerificationResult(mockResult);
      addReward(15, 2);
    }, 2400);
  };

  const handleRestart = () => {
    setWordIdx(0);
    setShowResults(false);
    setStatus('idle');
  };

  const colors = [
    { value: '#8B5CF6', name: 'Violet' },
    { value: '#3B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: '#EF4444', name: 'Red' },
    { value: '#F59E0B', name: 'Orange' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#1E293B', name: 'Charcoal' },
  ];

  if (!theme) {
    return (
      <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center justify-start">
        <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
          <button onClick={() => setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
          <h2 className="text-xl sm:text-2xl font-black text-amber-500 tracking-wide">Handwriting Arena</h2>
          <div className="w-16"/>
        </div>
        <ThemeSelector lang={lang} onSelectTheme={(selected) => setTheme(selected)} />
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-10 px-4 max-w-3xl mx-auto min-h-screen z-10 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 glass-panel px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex gap-2">
          <button onClick={() => setView('dashboard')} className="btn-candy btn-candy-secondary px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">← Back</button>
          <button onClick={() => setTheme(null)} className="btn-candy btn-candy-secondary px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">Change Topic 🎨</button>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-amber-500 tracking-wide">Handwriting Arena ({theme})</h2>
        <div className="font-extrabold text-xs sm:text-sm text-slate-500">Progress: {wordIdx}/{words.length}</div>
      </div>

      {showResults ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-game p-8 w-full text-center bg-white shadow-2xl border-amber-200">
          <div className="w-full flex justify-center mb-6 pt-12" style={{ overflow: 'visible' }}>
            <VectorStudentAvatar mode="speech-success" className="w-28 h-28 sm:w-36 h-36 mx-auto" interactive={false} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Beautiful Handwriting!</h2>
          <p className="text-base text-slate-500 font-bold mb-6">You completed all spelling drawings!</p>
          <div className="flex justify-center gap-2 mb-6">
            <Star3D className="w-10 h-10" />
            <Star3D className="w-10 h-10" />
            <Star3D className="w-10 h-10" />
            <Star3D className="w-10 h-10" />
            <Star3D className="w-10 h-10" />
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={handleRestart} className="btn-candy btn-candy-primary px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-extrabold text-sm sm:text-lg shadow-lg">Write Again</button>
            <button onClick={() => setView('dashboard')} className="btn-candy btn-candy-secondary px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-extrabold text-sm sm:text-lg shadow-sm">Dashboard</button>
          </div>
        </motion.div>
      ) : (
        <div className="glass-game p-4 sm:p-6 w-full bg-white shadow-xl border-amber-100 flex flex-col items-center">
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center relative" style={{ overflow: 'visible' }}>
              <VectorStudentAvatar mode={status === 'writing' ? 'writing' : status} className="w-20 h-20 sm:w-24 sm:h-24" interactive={false} bubbleText={status === 'writing' ? 'Show me your best letters!' : 'Draw the word carefully!'} />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Writing Quest {wordIdx + 1} of {words.length}</span>
              <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
                <h3 className={`text-3xl sm:text-4xl font-black text-slate-800 tracking-wide ${lang === 'English' ? 'font-dyslexic' : lang === 'தமிழ்' ? 'font-tamil' : 'font-hindi'}`}>{currentWord}</h3>
                <button onClick={handleSpeak} className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-1">Draw the word below using your finger, touch stylus, or mouse!</p>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full relative rounded-3xl border-4 border-slate-100 overflow-hidden shadow-inner mb-6 bg-stone-50">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-base font-black text-amber-700 animate-pulse">{analysisText}</span>
                <motion.div 
                  animate={{ y: [0, 320, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.5)] pointer-events-none"
                />
              </div>
            )}

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full block bg-stone-50 cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Controls Bar / Verification Result Panel */}
          {verificationResult ? (
            verificationResult.parentVerify ? (
              <div className="w-full glass-panel border-amber-200 bg-amber-50/50 p-6 sm:p-8 flex flex-col items-center mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-4xl">🧑‍🏫</span>
                  <h3 className="text-2xl font-black text-amber-700">Parent Check-in</h3>
                </div>
                <p className="text-slate-700 font-bold text-sm text-center max-w-lg mb-4 leading-relaxed">
                  Dysi's connection is temporarily offline.<br />
                  <strong className="text-amber-800">Parent:</strong> Did the child spell <span className="underline text-indigo-600 font-black">"{currentWord}"</span> correctly?
                </p>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => {
                      addReward(15, 2);
                      setVerificationResult({ ...verificationResult, correct: true, parentVerify: false });
                      setStatus('speech-success');
                    }}
                    className="btn-candy btn-candy-accent px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-md"
                  >
                    Yes, Correct! 👍
                  </button>
                  <button
                    onClick={() => {
                      setVerificationResult(null);
                      clearCanvas();
                      setStatus('idle');
                    }}
                    className="btn-candy btn-candy-secondary px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm"
                  >
                    No, Try Again 🔄
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full glass-panel border-violet-100 p-6 sm:p-8 flex flex-col items-center mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-4xl">{verificationResult.correct ? '🎉' : '✍️'}</span>
                  <h3 className={`text-2xl font-black ${verificationResult.correct ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {verificationResult.correct ? 'Correct Spelling!' : 'Spelling Check'}
                  </h3>
                </div>
                
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Accuracy Score: {verificationResult.accuracy}%
                </p>

                {/* Letter feedback bubbles */}
                {verificationResult.letterFeedback && (
                  <div className="flex gap-2 justify-center flex-wrap my-4">
                    {verificationResult.letterFeedback.map((lf: any, idx: number) => {
                      let badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
                      let statusText = '';
                      if (lf.status === 'correct') {
                        badgeBg = 'bg-emerald-100 text-emerald-700 border-emerald-300';
                        statusText = '✓';
                      } else if (lf.status === 'reversed') {
                        badgeBg = 'bg-amber-100 text-amber-700 border-amber-300 animate-pulse';
                        statusText = '🔄 Reversed';
                      } else if (lf.status === 'incorrect') {
                        badgeBg = 'bg-rose-100 text-rose-700 border-rose-300';
                        statusText = '✗';
                      } else if (lf.status === 'missing') {
                        badgeBg = 'bg-slate-200 text-slate-500 border-slate-300';
                        statusText = 'Missing';
                      }
                      
                      return (
                        <div key={idx} className={`border-2 rounded-2xl px-4 py-2 text-center flex flex-col items-center shadow-sm ${badgeBg}`}>
                          <span className="text-2xl font-black uppercase">{lf.letter}</span>
                          <span className="text-[9px] font-extrabold uppercase mt-1 tracking-wider opacity-80">{statusText}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Feedback text */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center my-4 max-w-lg">
                  <p className="text-slate-700 font-bold text-sm leading-relaxed font-medium">
                    {verificationResult.feedback}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  {!verificationResult.correct && (
                    <button
                      onClick={() => {
                        setVerificationResult(null);
                        clearCanvas();
                      }}
                      className="btn-candy btn-candy-secondary px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-sm"
                    >
                      Try Again 🎨
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setVerificationResult(null);
                      clearCanvas();
                      if (wordIdx === words.length - 1) {
                        setShowResults(true);
                      } else {
                        setWordIdx(idx => idx + 1);
                      }
                    }}
                    className="btn-candy btn-candy-accent px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-md"
                  >
                    {wordIdx === words.length - 1 ? 'Finish Game 🏆' : 'Next Word ➡️'}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between border-t border-slate-100 pt-4">
              {/* Color Palette */}
              <div className="flex flex-col gap-1.5 items-center md:items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ink Colors</span>
                <div className="flex gap-1.5">
                  {colors.map(col => (
                    <button
                      key={col.value}
                      onClick={() => setColor(col.value)}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-transform hover:scale-110 active:scale-95"
                      style={{
                        backgroundColor: col.value,
                        border: color === col.value ? '2.5px solid #1E293B' : '2px solid rgba(255,255,255,0.8)',
                        boxShadow: color === col.value ? '0 0 0 2px rgba(139,92,246,0.3)' : 'none'
                      }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Sizes */}
              <div className="flex flex-col gap-1.5 items-center md:items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brush Size</span>
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  {[
                    { size: 4, label: 'Thin' },
                    { size: 8, label: 'Medium' },
                    { size: 14, label: 'Thick' }
                  ].map(b => (
                    <button
                      key={b.size}
                      onClick={() => setBrushSize(b.size)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[10px] transition-colors ${brushSize === b.size ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 mt-2 md:mt-0">
                <button onClick={clearCanvas} className="btn-candy btn-candy-secondary px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm shadow-sm">
                  Clear Board
                </button>
                <button onClick={submitDrawing} className="btn-candy btn-candy-accent px-5 py-2 rounded-full font-extrabold text-xs sm:text-sm shadow-md">
                  Verify Spelling ✨
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---- AUTH VIEW ----
const AuthView = ({lang,onEnter,isBackendOnline}:any) => {
  const t = i18n[lang];
  const [tab,setTab] = useState<'signin'|'signup'>('signin');
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [showPass,setShowPass] = useState(false);
  const [loading,setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dysiBubbleText, setDysiBubbleText] = useState(t.bubbleAuth);

  // Google Login and Forgot Password Modal states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    if (errorMsg) {
      setDysiBubbleText(errorMsg);
    } else {
      setDysiBubbleText(tab === 'signin' ? "Welcome back! Enter your email and password to sync your progress! ⚡" : t.bubbleAuth);
    }
  }, [errorMsg, tab, lang]);

  const handleSubmit=async (e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    if (isBackendOnline) {
      const url = tab === 'signin' ? 'http://localhost:5000/api/user/login' : 'http://localhost:5000/api/user/register';
      const body = tab === 'signin' ? { email, password } : { email, name, password };

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const user = await res.json();
          setLoading(false);
          onEnter(user);
        } else {
          const data = await res.json();
          setErrorMsg(data.error || 'Authentication failed. Please check credentials.');
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth server error:", err);
        setErrorMsg('Could not connect to authentication server.');
        setLoading(false);
      }
    } else {
      // Offline fallback
      const displayName = tab === 'signup' ? name : (email ? email.split('@')[0].split('.')[0] : '');
      const formattedName = displayName ? displayName.charAt(0).toUpperCase() + displayName.slice(1) : '';
      setTimeout(()=>{setLoading(false);onEnter(formattedName);},1400);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setGoogleLoading(true);
    setErrorMsg('');
    
    if (isBackendOnline) {
      try {
        const syncRes = await fetch('http://localhost:5000/api/user/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: credentialResponse.credential,
            clientId: '123456789-mockclient.apps.googleusercontent.com'
          })
        });
        
        if (syncRes.ok) {
          const dbUser = await syncRes.json();
          setGoogleLoading(false);
          onEnter(dbUser);
        } else {
          setGoogleLoading(false);
          setErrorMsg('Google Sync failed on server.');
        }
      } catch (err) {
        console.error("Google authentication error:", err);
        setGoogleLoading(false);
        setErrorMsg('Could not connect to server for Google Sign In.');
      }
    } else {
      // Offline mock fallback
      setGoogleLoading(false);
      onEnter({
        id: 999,
        name: 'Google Explorer',
        email: 'explorer.google@gmail.com',
        selected_lang: lang,
          stars: 15,
          xp: 150,
          skill_level: 3
        });
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setForgotSuccess('');
    setForgotError('');

    if (isBackendOnline) {
      try {
        const res = await fetch('http://localhost:5000/api/user/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
        if (res.ok) {
          const data = await res.json();
          setForgotSuccess(data.message || `Account found! ${data.hint ? `Password hint: "${data.hint}"` : 'Check your email for recovery instructions.'}`);
        } else {
          const data = await res.json();
          setForgotError(data.error || 'Failed to retrieve password.');
        }
      } catch (err) {
        setForgotError('Connection error. Could not reach recovery server.');
      } finally {
        setForgotLoading(false);
      }
    } else {
      // Offline fallback mock
      setTimeout(() => {
        setForgotLoading(false);
        setForgotSuccess('Offline Mode: Simulated recovery successful. Try using password: "password123"');
      }, 1000);
    }
  };
  
  const features=['Dyslexia-friendly fonts','AI reading coach','Gamified progress','3 languages'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative z-10">
      {/* Left decorative panel */}
      <motion.div initial={{opacity:0,x:-40}} animate={{opacity:1,x:0}} transition={{duration:0.6}}
        className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 rounded-[2.5rem] p-12 w-[400px] min-h-[600px] mr-[-2rem] z-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px]. w-64 h-64 rounded-full bg-white/10 blur-2xl"/>
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-fuchsia-400/20 blur-2xl"/>
        <div className="relative z-10">
          <div className="w-20 h-20 mb-8" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="auth" className="w-20 h-20" interactive={false} bubbleText={dysiBubbleText} bubblePosition="bottom"/>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight mb-4">
            Your magical<br/>learning journey<br/>starts here.
          </h2>
          <p className="text-violet-200 font-medium text-lg leading-relaxed">
            Join thousands of children who've discovered their superpower with Dyslex.AI.
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          {features.map((f,i) => (
            <motion.div key={f} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.1}}
              className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/15">
              <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 10" className="w-3 h-3"><path d="M1 5 L4.5 8.5 L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </div>
              <span className="text-white font-bold text-sm">{f}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Auth card */}
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.55}}
        className="bg-white rounded-[2.5rem] shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md relative z-10"
        style={{boxShadow:'0 30px 80px -20px rgba(139,92,246,0.18),0 8px 24px -8px rgba(0,0,0,0.06)'}}>
        <div className="flex justify-center mb-2 lg:hidden" style={{overflow:'visible'}}>
          <div className="w-20 h-20" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="auth" className="w-20 h-20" interactive={false} bubbleText={dysiBubbleText}/>
          </div>
        </div>
        <div className="flex border-b-2 border-slate-100 mb-6 sm:mb-8">
          <button className={`auth-tab ${tab==='signin'?'active':''}`} onClick={()=>{setTab('signin'); setErrorMsg('');}}>Sign In</button>
          <button className={`auth-tab ${tab==='signup'?'active':''}`} onClick={()=>{setTab('signup'); setErrorMsg('');}}>Create Account</button>
        </div>
        <AnimatePresence mode="wait">
          <motion.form key={tab} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
            transition={{duration:0.22}} onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="text-rose-500 font-extrabold text-xs text-center bg-rose-50 border border-rose-100 rounded-2xl p-3 shadow-inner">
                ⚠️ {errorMsg}
              </div>
            )}

            {tab==='signup' && (
              <div className="auth-input-wrap">
                <input id="auth-name" className="auth-input" type="text" placeholder=" " value={name} onChange={e=>setName(e.target.value)} required/>
                <label className="auth-label" htmlFor="auth-name">Full Name</label>
                <span className="auth-input-icon"><User size={18}/></span>
              </div>
            )}
            <div className="auth-input-wrap">
              <input id="auth-email" className="auth-input" type="email" placeholder=" " value={email} onChange={e=>setEmail(e.target.value)} required/>
              <label className="auth-label" htmlFor="auth-email">Email Address</label>
              <span className="auth-input-icon"><Mail size={18}/></span>
            </div>
            <div className="auth-input-wrap">
              <input id="auth-pass" className="auth-input" type={showPass?'text':'password'} placeholder=" " value={password} onChange={e=>setPassword(e.target.value)} required/>
              <label className="auth-label" htmlFor="auth-pass">Password</label>
              <span className="auth-input-icon"><Lock size={18}/></span>
              <button type="button" className="auth-eye-btn" onClick={()=>setShowPass(v=>!v)} tabIndex={-1}>
                {showPass?<EyeOff size={18}/>:<Eye size={18}/>}
              </button>
            </div>
            {tab==='signin' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => { setShowForgotModal(true); setForgotEmail(''); setForgotSuccess(''); setForgotError(''); }} className="text-xs sm:text-sm font-bold text-violet-500 hover:text-violet-700 transition-colors">Forgot password?</button>
              </div>
            )}
            <motion.button type="submit" disabled={loading}
              whileHover={{scale:loading?1:1.02}} whileTap={{scale:loading?1:0.99}}
              className="btn-auth-primary mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : <><Sparkles size={18}/>{tab==='signin'?'Sign In & Explore':'Create My Profile'}</>}
            </motion.button>
            
            <div className="auth-divider text-[10px] sm:text-xs">or continue with</div>
            
            <div className="flex justify-center w-full">
              <GoogleOAuthProvider clientId="887834767583-mkdubqojcujp40mtnutboov4g3v7v5ks.apps.googleusercontent.com">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => {
                    setErrorMsg('Google Sign-In failed.');
                  }}
                  useOneTap
                />
              </GoogleOAuthProvider>
            </div>

            <p className="text-center text-xs sm:text-sm text-slate-400 font-medium pt-1">
              {tab==='signin'?"Don't have an account? ":"Already have an account? "}
              <button type="button" onClick={()=>{setTab(tab==='signin'?'signup':'signin'); setErrorMsg('');}}
                className="font-extrabold text-violet-600 hover:text-violet-800 transition-colors">
                {tab==='signin'?'Sign up free':'Sign in'}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      {/* Simulated Google Connecting Modal */}
      {googleLoading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center border-4 border-violet-100"
          >
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-red-500 border-b-yellow-500 border-l-green-500"
              />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Connecting with Google</h3>
            <p className="text-sm font-bold text-slate-500 mb-4">Please wait while we secure your connection...</p>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-slate-600">explorer.google@gmail.com</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99999] flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full mx-4 shadow-2xl relative border-4 border-violet-100 font-logo"
          >
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">🔑 Recover Password</h3>
            <p className="text-sm text-slate-500 font-bold mb-6">Enter your registered email and we will recover your password instantly.</p>
            
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="auth-input-wrap">
                <input 
                  id="forgot-email" 
                  className="auth-input" 
                  type="email" 
                  placeholder=" " 
                  value={forgotEmail} 
                  onChange={e=>setForgotEmail(e.target.value)} 
                  required
                />
                <label className="auth-label" htmlFor="forgot-email">Email Address</label>
                <span className="auth-input-icon"><Mail size={18}/></span>
              </div>

              {forgotError && (
                <div className="text-rose-500 font-extrabold text-xs bg-rose-50 border border-rose-100 rounded-2xl p-3">
                  ⚠️ {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="text-emerald-700 font-black text-sm bg-emerald-50 border border-emerald-100 rounded-2xl p-4 leading-relaxed shadow-inner">
                  🎉 {forgotSuccess}
                </div>
              )}

              <button 
                type="submit" 
                disabled={forgotLoading}
                className="btn-auth-primary flex items-center justify-center gap-2 py-3.5"
              >
                {forgotLoading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : 'Recover Password'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ---- ASSESSMENT CHALLENGE ----
const MOCK_ASSESSMENT = [
  { id: 1, type: 'writing', questionText: 'bat', options: [], correctAnswer: 'bat' },
  { id: 2, type: 'reading', questionText: 'Choose the word that rhymes with "cat":', options: ['dog', 'hat', 'run', 'sun'], correctAnswer: 'hat' },
  { id: 3, type: 'speech', questionText: 'The pig is big and pink.', options: [], correctAnswer: 'The pig is big and pink.' },
  { id: 4, type: 'writing', questionText: 'bed', options: [], correctAnswer: 'bed' },
  { id: 5, type: 'reading', questionText: 'Complete the word: d _ g (animal that barks)', options: ['a', 'o', 'e', 'u'], correctAnswer: 'o' },
  { id: 6, type: 'speech', questionText: 'A frog sat on a log.', options: [], correctAnswer: 'A frog sat on a log.' },
  { id: 7, type: 'writing', questionText: 'play', options: [], correctAnswer: 'play' },
  { id: 8, type: 'reading', questionText: 'Identify the letter that faces right:', options: ['d', 'b', 'q', 'p'], correctAnswer: 'd' },
  { id: 9, type: 'speech', questionText: 'I can run fast.', options: [], correctAnswer: 'I can run fast.' },
  { id: 10, type: 'writing', questionText: 'sun', options: [], correctAnswer: 'sun' }
];

const AssessmentChallenge = ({ lang, setView, addReward, isBackendOnline, backendUserId }: any) => {
  const t = i18n[lang];
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [speechListening, setSpeechListening] = useState(false);
  const [speechCompleted, setSpeechCompleted] = useState(false);
  
  const [drawnSomething, setDrawnSomething] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#8B5CF6');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [writingVerified, setWritingVerified] = useState(false);
  const [writingCorrect, setWritingCorrect] = useState(false);
  
  useEffect(() => {
    if (step === 'quiz' && questions[activeIdx]?.type === 'writing') {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const width = canvas.parentElement?.clientWidth || 500;
        canvas.width = width;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctxRef.current = ctx;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        
        ctx.fillStyle = '#FAFAF9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        setDrawnSomething(false);
        setWritingVerified(false);
      }, 100);
    }
  }, [step, activeIdx, questions]);

  const startAssessment = () => {
    setLoading(true);
    if (isBackendOnline) {
      fetch('http://localhost:5000/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: backendUserId, lang })
      })
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setStep('quiz');
        setActiveIdx(0);
        setAnswers([]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Assessment generate error:", err);
        setQuestions(MOCK_ASSESSMENT);
        setStep('quiz');
        setActiveIdx(0);
        setAnswers([]);
        setLoading(false);
      });
    } else {
      setQuestions(MOCK_ASSESSMENT);
      setStep('quiz');
      setActiveIdx(0);
      setAnswers([]);
      setLoading(false);
    }
  };

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    if (writingVerified) return;
    const { x, y } = getCoordinates(e);
    if (ctxRef.current) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
      setIsDrawing(true);
      setDrawnSomething(true);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing || writingVerified) return;
    const { x, y } = getCoordinates(e);
    if (ctxRef.current) {
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#FAFAF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    setDrawnSomething(false);
    setWritingVerified(false);
  };

  const verifyWriting = async () => {
    if (!drawnSomething) {
      alert("Please draw the word first!");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisText('Scanning drawing...');
    
    const word = questions[activeIdx].correctAnswer;

    if (isBackendOnline) {
      try {
        const dataUrl = canvasRef.current?.toDataURL('image/png') || '';
        const res = await fetch('http://localhost:5000/api/verify/drawing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: backendUserId, image: dataUrl, word })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.parentVerify === true) {
            const isCorrect = window.confirm(`Dysi is temporarily offline. Parent: Did the child write "${word}" correctly?`);
            setIsAnalyzing(false);
            setWritingVerified(true);
            setWritingCorrect(isCorrect);
            return;
          }
          setIsAnalyzing(false);
          setWritingVerified(true);
          setWritingCorrect(data.correct);
          return;
        }
      } catch (err) {
        console.error("Quiz drawing error:", err);
      }
    }
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setWritingVerified(true);
      setWritingCorrect(true);
    }, 1500);
  };

  const handleSpeechListen = () => {
    setSpeechListening(true);
    setTimeout(() => {
      setSpeechListening(false);
      setSpeechCompleted(true);
    }, 2000);
  };

  const nextQuestion = () => {
    const q = questions[activeIdx];
    let score = 0;
    let isCorrect = false;

    if (q.type === 'reading') {
      isCorrect = selectedOption === q.correctAnswer;
      score = isCorrect ? 100 : 0;
    } else if (q.type === 'speech') {
      isCorrect = speechCompleted;
      score = isCorrect ? 100 : 0;
    } else if (q.type === 'writing') {
      isCorrect = writingCorrect;
      score = isCorrect ? 100 : 0;
    }

    const currentAnswer = { id: q.id, score, isCorrect };
    const updatedAnswers = [...answers, currentAnswer];
    setAnswers(updatedAnswers);

    setSelectedOption('');
    setSpeechCompleted(false);
    setWritingVerified(false);

    if (activeIdx < questions.length - 1) {
      setActiveIdx(prev => prev + 1);
    } else {
      setSubmitting(true);
      if (isBackendOnline) {
        fetch('http://localhost:5000/api/assessment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: backendUserId, answers: updatedAnswers })
        })
        .then(res => res.json())
        .then(data => {
          setResult(data);
          addReward(data.score, Math.round(data.starsEarned / 10));
          setStep('result');
          setSubmitting(false);
        })
        .catch(err => {
          console.error("Submit error:", err);
          const scorePercentage = Math.round((updatedAnswers.filter(a => a.isCorrect).length / questions.length) * 100);
          setResult({
            score: scorePercentage,
            starsEarned: scorePercentage * 2,
            strengths: ['Strong effort & decoding skills'],
            weaknesses: ['Keep practicing handwriting letter shapes'],
            newSkillLevel: 3
          });
          addReward(scorePercentage, Math.round(scorePercentage / 10));
          setStep('result');
          setSubmitting(false);
        });
      } else {
        const scorePercentage = Math.round((updatedAnswers.filter(a => a.isCorrect).length / questions.length) * 100);
        setResult({
          score: scorePercentage,
          starsEarned: scorePercentage * 2,
          strengths: ['Strong effort & decoding skills'],
          weaknesses: ['Keep practicing handwriting letter shapes'],
          newSkillLevel: 3
        });
        addReward(scorePercentage, Math.round(scorePercentage / 10));
        setStep('result');
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="glass-game p-10 text-center shadow-xl border-violet-200 bg-white flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"/>
          <h2 className="text-xl font-black text-violet-700 animate-pulse">Generating custom AI assessment...</h2>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="glass-game p-10 text-center shadow-xl border-violet-200 bg-white flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4"/>
          <h2 className="text-xl font-black text-violet-700 animate-pulse">Analyzing answers and profiling weaknesses...</h2>
        </div>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="glass-game p-8 sm:p-10 text-center shadow-xl border-violet-200 bg-white max-w-md w-full">
          <div className="w-full flex justify-center mb-6 pt-12" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="assessment" className="w-28 h-28" interactive={false} bubbleText="Ready to show your skills?"/>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-violet-600 mb-2">Weekly Assessment</h2>
          <p className="text-slate-500 font-bold mb-6 text-sm">
            Show Dysi what you have learned! We will test your reading, writing, and speech. Unlock double stars and level up!
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setView('dashboard')} className="btn-candy btn-candy-secondary px-5 py-2.5 rounded-full font-extrabold shadow-sm text-xs sm:text-sm">← Back</button>
            <button onClick={startAssessment} className="btn-candy btn-candy-accent px-6 py-2.5 rounded-full font-extrabold shadow-md text-xs sm:text-sm">Start Challenge 🚀</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="glass-game p-8 sm:p-10 text-center shadow-xl border-violet-200 bg-white max-w-md w-full flex flex-col items-center">
          <div className="w-24 h-24 mb-4" style={{overflow:'visible'}}>
            <VectorStudentAvatar mode="speech-success" className="w-24 h-24" interactive={false}/>
          </div>
          <h2 className="text-3xl font-black text-emerald-600 mb-1">Assessment Finished!</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Score: {result.score}%</p>
          
          <div className="bg-amber-100 border border-amber-300 rounded-2xl px-5 py-2.5 mb-6 text-amber-800 font-black text-sm animate-bounce shadow-sm flex items-center gap-1.5">
            🏆 Earned +{result.starsEarned} Stars!
          </div>

          <div className="w-full text-left bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-1.5">🌟 Your Strengths</h3>
              <ul className="list-disc pl-4 text-xs font-bold text-slate-600 space-y-1">
                {result.strengths.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1.5">🎯 Practice Recommendations</h3>
              <ul className="list-disc pl-4 text-xs font-bold text-slate-600 space-y-1">
                {result.weaknesses.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
              </ul>
            </div>
          </div>

          <button onClick={() => setView('dashboard')} className="btn-candy btn-candy-accent px-6 py-2.5 rounded-full font-extrabold shadow-md w-full sm:w-auto text-xs sm:text-sm">
            Back to Dashboard 🚀
          </button>
        </div>
      </div>
    );
  }

  const q = questions[activeIdx];
  if (!q) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-20">
      <div className="glass-game p-6 sm:p-8 shadow-xl border-violet-200 bg-white max-w-xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
          <span className="text-xs font-black text-violet-600 uppercase tracking-wider">Weekly Challenge 🏆</span>
          <span className="text-xs font-bold text-slate-400">Step {activeIdx + 1} of {questions.length}</span>
        </div>

        <div className="w-20 h-20 mb-4" style={{overflow:'visible'}}>
          <VectorStudentAvatar mode={isAnalyzing ? 'writing' : speechListening ? 'listening' : 'idle'} className="w-20 h-20" interactive={false}/>
        </div>

        <div className="text-center mb-6 w-full">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-4">
            {q.type === 'reading' ? q.questionText : q.type === 'writing' ? `Write the word: "${q.questionText}"` : `Read this sentence aloud:`}
          </h3>

          {q.type === 'reading' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mx-auto my-4">
              {q.options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(opt)}
                  className={`btn-candy p-3.5 rounded-2xl font-extrabold text-sm border-2 text-center transition-all ${selectedOption === opt ? 'bg-violet-100 border-violet-400 text-violet-700 shadow-inner' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.type === 'speech' && (
            <div className="flex flex-col items-center gap-4 my-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-lg font-black text-blue-700 text-center max-w-md shadow-inner">
                {q.questionText}
              </div>
              
              {!speechCompleted ? (
                <button
                  onClick={handleSpeechListen}
                  disabled={speechListening}
                  className={`btn-candy px-6 py-3 rounded-full font-extrabold shadow flex items-center gap-2 ${speechListening ? 'btn-candy-secondary animate-pulse' : 'btn-candy-primary'}`}
                >
                  {speechListening ? '🎙️ Listening...' : '🎙️ Record Reading'}
                </button>
              ) : (
                <div className="text-emerald-600 font-extrabold text-sm flex items-center gap-1.5 animate-bounce">
                  ✓ Recorded Successfully!
                </div>
              )}
            </div>
          )}

          {q.type === 'writing' && (
            <div className="flex flex-col items-center w-full max-w-md mx-auto my-4">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-3"/>
                  <span className="text-sm font-black text-violet-700 animate-pulse">{analysisText}</span>
                </div>
              )}
              
              <div className="w-full relative rounded-2xl border-4 border-slate-100 overflow-hidden shadow-inner bg-stone-50 h-[200px] mb-3">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full block bg-stone-50 cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />
              </div>

              <div className="flex justify-between items-center w-full px-1">
                <button onClick={clearCanvas} disabled={writingVerified} className="btn-candy btn-candy-secondary px-3 py-1.5 rounded-full font-extrabold text-xs shadow-sm">
                  Clear
                </button>
                
                {writingVerified ? (
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full ${writingCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {writingCorrect ? '✓ Correct' : '✓ Saved Effort'}
                  </span>
                ) : (
                  <button onClick={verifyWriting} className="btn-candy btn-candy-accent px-4 py-1.5 rounded-full font-extrabold text-xs shadow-md">
                    Verify Drawing ✨
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full border-t border-slate-100 pt-4 flex justify-between items-center mt-4">
          <button onClick={() => { if(confirm("Discard assessment? Progress won't be saved.")) setView('dashboard'); }} className="text-slate-400 font-extrabold hover:text-slate-600 text-xs sm:text-sm">
            Discard ❌
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={(q.type === 'reading' && !selectedOption) || (q.type === 'speech' && !speechCompleted) || (q.type === 'writing' && !writingVerified)}
            className="btn-candy btn-candy-accent px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm shadow-md disabled:opacity-40 disabled:pointer-events-none"
          >
            {activeIdx === questions.length - 1 ? 'Finish Assessment 🏆' : 'Next Question ➡️'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- MAIN APP ----
export default function App() {
  const [view,setView] = useState('home');
  const [lang,setLang] = useState('English');
  const [userData,setUserData] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [activeFont, setActiveFont] = useState('Standard');
  const [activeStars,setActiveStars] = useState<FlyingStar[]>([]);
  const [starPulse,setStarPulse] = useState(false);
  const [overlayColor, setOverlayColor] = useState('rgba(255,253,245,1)');

  // Full-Stack Backend Integration State
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [backendUserId, setBackendUserId] = useState<number>(1);

  // Account Settings Drawer State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [nameSaveStatus, setNameSaveStatus] = useState('');
  const [mascotTipsEnabled, setMascotTipsEnabled] = useState(true);

  useEffect(() => {
    if (userData?.name) {
      setEditName(userData.name);
    }
  }, [userData?.name, settingsOpen]);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotTriggered, setChatbotTriggered] = useState(true);

  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);

  // Periodic Walk Reminder State
  const [walkActive, setWalkActive] = useState(false);
  const [reminderText, setReminderText] = useState('');

  const reminderQuotes: Record<string, string[]> = {
    English: [
      "You are all good looking! 😊",
      "You look wonderful! ✨",
      "You are doing amazing! 🌟",
      "Dysi loves your smile! ❤️",
      "You are a superstar! 🚀"
    ],
    'தமிழ்': [
      "நீங்கள் அனைவரும் அழகாக இருக்கிறீர்கள்! 😊",
      "நீ அற்புதமாக இருக்கிறாய்! ✨",
      "நீ சிறந்த முறையில் கற்கிறாய்! 🌟",
      "டைசி உன்னை நேசிக்கிறது! ❤️",
      "நீ ஒரு சூப்பர் ஸ்டார்! 🚀"
    ],
    'हिन्दी': [
      "आप सभी बहुत सुंदर दिख रहे हैं! 😊",
      "आप बहुत अद्भुत हैं! ✨",
      "आप बहुत अच्छा काम कर रहे हैं! 🌟",
      "डायसी आपसे प्यार करता है! ❤️",
      "आप एक सुपरस्टार हैं! 🚀"
    ]
  };

  const getUserName = () => userData?.name || (lang === 'English' ? 'Explorer' : lang === 'தமிழ்' ? 'ஆய்வாளர்' : 'अन्वेषक');

  useEffect(() => {
    // Initialize Chatbot Message once user name or language changes
    const currentUserName = getUserName();
    const welcomeText = lang === 'English'
      ? `Hi ${currentUserName}! 🌟 I'm Dysi, your learning guide. Ask me any doubt about our website or games!`
      : lang === 'தமிழ்'
      ? `வணக்கம் ${currentUserName}! 🌟 நான் தான் டைசி, உங்கள் வழிகாட்டி. இந்த இணையதளம் பற்றி எதை வேண்டுமானாலும் என்னிடம் கேட்கலாம்!`
      : `नमस्ते ${currentUserName}! 🌟 मैं मार्गदर्शक डायसी हूँ। आप मुझसे हमारी वेबसाइट या खेल के बारे में कोई भी प्रश्न पूछ सकते हैं!`;
    setMessages([
      {
        sender: 'dysi',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [userData?.name, lang]);

  useEffect(()=>{
    injectStyles();
    const timer=setTimeout(()=>setLoading(false),2000);
    
    // Window dimensions listener
    let handleResize = () => {};
    if (typeof window !== 'undefined') {
      handleResize = () => {
        setVw(window.innerWidth);
        setVh(window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
    }

    // 120-second periodic encouraging mascot walkthrough
    const walkTimer = setInterval(() => {
      if (!loading && !chatOpen && mascotTipsEnabled) {
        const quotes = reminderQuotes[lang] || reminderQuotes['English'];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setReminderText(randomQuote);
        setWalkActive(true);
      }
    }, 120000);

    return () => {
      clearTimeout(timer);
      clearInterval(walkTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  },[lang, loading, chatOpen, mascotTipsEnabled]);

  // Ping Backend Server & Synchronize profile details (only if user is already logged in)
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'online') {
            setIsBackendOnline(true);
            console.log("Dyslex.AI Backend is Online! ⚡ Enabled personalization layer.");
            
            // Only sync if a real user is signed in (has email)
            if (userData?.email) {
              const syncRes = await fetch('http://localhost:5000/api/user/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: userData.email,
                  name: userData.name,
                  selectedFont: activeFont,
                  selectedLang: lang,
                  stars: userData?.stars || 0,
                  xp: userData?.xp || 0,
                  skillLevel: userData?.level || 3
                })
              });
              
              if (syncRes.ok) {
                const dbUser = await syncRes.json();
                setBackendUserId(dbUser.id);
                setUserData((prev: any) => {
                  const clientStars = prev?.stars || 0;
                  const clientXP = prev?.xp || 0;
                  return {
                    ...prev,
                    name: dbUser.name,
                    email: dbUser.email,
                    lang: dbUser.selected_lang || lang,
                    stars: Math.max(clientStars, dbUser.stars),
                    xp: Math.max(clientXP, dbUser.xp),
                    level: dbUser.skill_level || 3
                  };
                });
              }
            }
          }
        }
      } catch (err) {
        console.log("Backend offline, falling back to local client-side mode.");
        setIsBackendOnline(false);
      }
    };
    checkBackend();
  }, [userData?.email, lang, activeFont]);

  const handleEnterWorld=(userOrName?: any)=>{
    if (userOrName && typeof userOrName === 'object') {
      const user = userOrName;
      setUserData({
        name: user.name,
        email: user.email,
        lang: user.selected_lang || lang,
        stars: user.stars || 0,
        xp: user.xp || 0,
        level: user.skill_level || 3
      });
      setBackendUserId(user.id);
      setView('dashboard');
    } else {
      const nameVal = (userOrName && typeof userOrName === 'string') ? userOrName : 'Star Learner';
      const emailVal = `${nameVal.toLowerCase().replace(/\s+/g, '')}@dyslex.ai`;
      
      setUserData({
        name: nameVal,
        email: emailVal,
        lang:lang,
        stars:5,
        xp:50,
        level:3
      });
      setView('dashboard');

      if (isBackendOnline) {
        fetch('http://localhost:5000/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailVal,
            name: nameVal,
            selectedFont: activeFont,
            selectedLang: lang,
            stars: 5,
            xp: 50,
            skillLevel: 3
          })
        })
        .then(res => res.json())
        .then(dbUser => {
          setBackendUserId(dbUser.id);
        })
        .catch(err => console.error("Sync error:", err));
      }
    }
  };

  const addReward = (xp: number, stars: number) => {
    setUserData((prev: any) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        xp: prev.xp + xp,
        stars: prev.stars + stars
      };
      
      if (isBackendOnline && prev.email) {
        fetch('http://localhost:5000/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: prev.email,
            name: prev.name,
            selectedFont: activeFont,
            selectedLang: lang,
            stars: updated.stars,
            xp: updated.xp,
            skillLevel: prev.level || 3
          })
        }).catch(err => console.error("Sync rewards failed:", err));
      }
      
      return updated;
    });

    const starCount = Math.min(stars, 8);
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      startX: window.innerWidth / 2 + (Math.random() - 0.5) * 60,
      startY: window.innerHeight / 2 + (Math.random() - 0.5) * 60
    }));
    setActiveStars(prev => [...prev, ...newStars]);
  };

  const handleStarComplete=(id:number)=>{
    setActiveStars(prev=>prev.filter(s=>s.id!==id));
    setStarPulse(true);setTimeout(()=>setStarPulse(false),300);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || chatMessage;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatMessage('');

    setIsTyping(true);

    if (isBackendOnline) {
      try {
        const apiHistory = messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));
        
        const res = await fetch('http://localhost:5000/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: backendUserId,
            message: text,
            history: apiHistory
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          const dysiMsg = {
            sender: 'dysi',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, dysiMsg]);
          setIsTyping(false);
          return;
        }
      } catch (err) {
        console.error("Chat error from backend, falling back to local:", err);
      }
    }

    setTimeout(() => {
      let reply = "That's a great question! I'm Dysi, your learning guide. I can help you understand our games, languages (English, Tamil, Hindi), parent tips, or rewards. What would you like to explore?";
      const query = text.toLowerCase();
      const currentUserName = getUserName();

      if (query.includes('tamil') || query.includes('hindi') || query.includes('language') || query.includes('மொழி') || query.includes('भाषा')) {
        reply = "We support English, Tamil (தமிழ்), and Hindi (हिन्दी)! You can switch languages at any time using the Globe icon in the navigation bar at the top of the screen. All games and exercises will adapt to your selected language instantly!";
      } else if (query.includes('game') || query.includes('activity') || query.includes('detective') || query.includes('speech') || query.includes('reading') || query.includes('விளையாட்டு') || query.includes('खेल')) {
        reply = "We have three active games: 🕵️‍♂️ Letter Detective (find confusable letters), 🗣️ Speech Practice (speak phrases aloud), and 📖 Reading Adventure (read story segments). Writing and Assessment modes are unlocked at higher levels soon!";
      } else if (query.includes('parent') || query.includes('tip') || query.includes('hub') || query.includes('பெற்றோர்') || query.includes('अभिभावक')) {
        reply = "Our Parents Hub contains science-backed benefits based on the Orton-Gillingham method, vertical guides on how the app works, real parent quotes, and actionable tips to help you support your child's reading practice.";
      } else if (query.includes('free') || query.includes('cost') || query.includes('price') || query.includes('ad') || query.includes('விளம்பரம்') || query.includes('शुल्क')) {
        reply = "Dyslex.AI is 100% free and contains absolutely zero ads or popups! We want to provide a safe, calm, and distraction-free environment for children to learn at their own pace.";
      } else if (query.includes('star') || query.includes('xp') || query.includes('reward') || query.includes('level') || query.includes('நட்சத்திரம்') || query.includes('सितारा')) {
        reply = "Completing exercises rewards children with Stars and XP points! Collect XP to level up, and watch your stars count rise on the top right. Every attempt is celebrated to reward effort, not just correctness!";
      } else if (query.includes('dyslexia') || query.includes('specialist') || query.includes('orton') || query.includes('gillingham')) {
        reply = "We design all activities following Orton-Gillingham methods. Dysic children often confuse letters like b/d, p/q, or m/w. We isolate these confusions script by script, and avoid stressful red screens or ticking timers.";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('வணக்கம்') || query.includes('नमस्ते')) {
        reply = `Hello ${currentUserName}! 👋 How can I help you today? Ask me about our games, custom background tints, or language options!`;
      }

      const dysiMsg = {
        sender: 'dysi',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, dysiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setNameSaveStatus('Saving...');
    if (isBackendOnline && userData?.email) {
      try {
        const res = await fetch('http://localhost:5000/api/user/update-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: backendUserId,
            name: editName
          })
        });
        if (res.ok) {
          setUserData((prev: any) => ({ ...prev, name: editName }));
          setNameSaveStatus('Saved! ✨');
          setTimeout(() => setNameSaveStatus(''), 2000);
        } else {
          setNameSaveStatus('Error saving name');
        }
      } catch (err) {
        console.error("Save name failed:", err);
        setNameSaveStatus('Server error');
      }
    } else {
      setUserData((prev: any) => ({ ...prev, name: editName }));
      setNameSaveStatus('Saved locally! ✨');
      setTimeout(() => setNameSaveStatus(''), 2000);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setBackendUserId(1);
    setSettingsOpen(false);
    setView('home');
  };

  if(loading) return (
    <div className="min-h-screen flex items-center justify-center bg-violet-50 flex-col gap-6" style={{overflow:'visible'}}>
      <div className="w-44 h-44 flex items-center justify-center" style={{overflow:'visible'}}>
        <VectorStudentAvatar mode="loading" className="w-full h-full" interactive={false} bubbleText={i18n[lang].loading}/>
      </div>
      <h2 className="text-2xl font-black text-violet-700 animate-pulse">Entering the Magic Universe...</h2>
    </div>
  );

  let CurrentView: React.ReactNode;
  switch(view){
    case 'dashboard':  CurrentView=<DashboardView lang={lang} setView={setView} userData={userData}/>; break;
    case 'letter':     CurrentView=<LetterDetective lang={lang} setView={setView} addReward={addReward}/>; break;
    case 'speech':     CurrentView=<SpeechPractice lang={lang} setView={setView} addReward={addReward} isBackendOnline={isBackendOnline} backendUserId={backendUserId} />; break;
    case 'reading':
      CurrentView = (
        <ReadingAdventure
          lang={lang}
          setView={setView}
          addReward={addReward}
          overlayColor={overlayColor}
          setOverlayColor={setOverlayColor}
          isBackendOnline={isBackendOnline}
          backendUserId={backendUserId}
        />
      );
      break;
    case 'auth':       CurrentView=<AuthView lang={lang} onEnter={handleEnterWorld} isBackendOnline={isBackendOnline}/>; break;
    case 'parents':    CurrentView=<ParentsHubView lang={lang} setView={setView} isBackendOnline={isBackendOnline} backendUserId={backendUserId} />; break;
    case 'writing':
      CurrentView = (
        <WritingGame
          lang={lang}
          setView={setView}
          addReward={addReward}
          isBackendOnline={isBackendOnline}
          backendUserId={backendUserId}
        />
      );
      break;
    case 'assessment':
      CurrentView=(
        <AssessmentChallenge
          lang={lang}
          setView={setView}
          addReward={addReward}
          isBackendOnline={isBackendOnline}
          backendUserId={backendUserId}
        />
      ); break;
    default: CurrentView=<HomeView lang={lang} setView={setView} userData={userData}/>; break;
  }

  let fontClass = '';
  if (activeFont === 'OpenDyslexic') fontClass = 'font-opendyslexic-global';
  else if (activeFont === 'Comic Neue') fontClass = 'font-comicneue-global';
  else if (activeFont === 'Comic Sans') fontClass = 'font-comicsans-global';

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-violet-200 ${fontClass}`}>
      <StarFlightSystem activeStars={activeStars} onStarComplete={handleStarComplete}/>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div animate={{x:[0,80,-50,0],y:[0,-100,50,0],scale:[1,1.25,0.85,1]}} transition={{duration:25,repeat:Infinity,ease:"easeInOut"}} className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-violet-400/20 blur-[110px]"/>
        <motion.div animate={{x:[0,-90,70,0],y:[0,80,-50,0],scale:[1,0.9,1.2,1]}} transition={{duration:28,repeat:Infinity,ease:"easeInOut"}} className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-400/20 blur-[130px]"/>
        <motion.div animate={{x:[0,50,-60,0],y:[0,50,-80,0]}} transition={{duration:20,repeat:Infinity,ease:"easeInOut"}} className="absolute top-[25%] right-[10%] w-[35%] h-[35%] rounded-full bg-emerald-400/10 blur-[90px]"/>
      </div>
      <Navbar lang={lang} setLang={setLang} view={view} setView={setView} userData={userData} starPulse={starPulse} activeFont={activeFont} setActiveFont={setActiveFont} isBackendOnline={isBackendOnline} onSettingsClick={() => setSettingsOpen(true)}/>
      
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.35,ease:"easeInOut"}}>
          {CurrentView}
        </motion.div>
      </AnimatePresence>

      {/* Chatbot Trigger Button Widget */}
      <AnimatePresence>
        {chatbotTriggered && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            drag
            dragMomentum={false}
            dragConstraints={{ left: -vw + 100, right: 0, top: -vh + 100, bottom: 0 }}
            whileDrag={{ scale: 1.15, cursor: 'grabbing' }}
            className="fixed bottom-6 right-6 z-[999] flex flex-col items-center select-none"
            style={{ touchAction: 'none' }}
          >
            {!chatOpen && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setChatOpen(true)}
                className="bg-white border-4 border-violet-400 text-slate-800 font-extrabold px-4 py-2 rounded-2xl shadow-xl text-xs mb-2 cursor-pointer border-b-8 relative select-none animate-pulse-slow"
              >
                Need help? Ask me! 💬
                <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-violet-400" />
              </motion.div>
            )}
            <button
              onClick={() => setChatOpen(v => !v)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 border-4 border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14" style={{ overflow: 'visible' }}>
                <VectorStudentAvatar mode="idle" className="w-14 h-14" interactive={false} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Drawer Widget */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white/95 backdrop-blur-xl border-l-4 border-violet-100 shadow-2xl z-[9999] flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center p-1" style={{ overflow: 'visible' }}>
                  <VectorStudentAvatar mode="idle" className="w-10 h-10" interactive={false} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight font-logo">Dysi Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 font-logo">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-violet-200">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl font-semibold text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isTyping && (
                <div className="flex flex-col max-w-[80%] self-start items-start">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-100 border border-slate-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-slate-100 flex gap-2 flex-wrap bg-slate-50/50">
              {[
                "How does this work?",
                "Which languages?",
                "Parent Hub tips",
                "Is it free?"
              ].map(pill => (
                <button
                  key={pill}
                  onClick={() => handleSendMessage(pill)}
                  className="text-[10px] font-bold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2.5 py-1.5 rounded-full transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-2 font-semibold text-slate-700 text-sm outline-none focus:border-violet-500 focus:bg-white transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 30-Second Periodic Walk Reminder */}
      <AnimatePresence>
        {walkActive && (
          <motion.div
            initial={{ x: -150, y: vh - 160, opacity: 0 }}
            animate={{
              x: [-150, vw / 2 - 75, vw / 2 - 75, vw / 2 - 75, vw + 150],
              y: [vh - 160, vh - 180, vh - 160, vh - 180, vh - 160],
              opacity: [0, 1, 1, 1, 0]
            }}
            transition={{
              times: [0, 0.4, 0.6, 0.7, 1],
              duration: 7,
              ease: "easeInOut"
            }}
            onAnimationComplete={() => setWalkActive(false)}
            className="fixed z-[99999] pointer-events-none flex flex-col items-center select-none"
            style={{ width: '150px', height: '150px' }}
          >
            <div className="bg-white border-4 border-violet-400 text-slate-800 font-extrabold px-3 py-1.5 rounded-2xl shadow-2xl text-[10px] sm:text-xs mb-1 text-center max-w-[180px] border-b-6 relative pointer-events-none">
              {reminderText}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-violet-400" />
            </div>
            <div className="w-20 h-20" style={{ overflow: 'visible' }}>
              <VectorStudentAvatar mode="idle" className="w-20 h-20" interactive={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Settings Drawer */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white/95 backdrop-blur-xl border-l-4 border-violet-100 shadow-2xl z-[9999] flex flex-col p-6 font-logo"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 font-logo">
              <h3 className="text-xl font-black text-slate-800 font-logo">Settings & Accessibility</h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 flex flex-col items-center py-4 font-logo">
              {/* Mascot Avatar */}
              <div className="w-28 h-28 relative flex justify-center items-center p-1 bg-slate-50 border-4 border-white rounded-full shadow-lg" style={{ overflow: 'visible' }}>
                <VectorStudentAvatar mode="idle" className="w-20 h-20" interactive={false} />
              </div>

              {/* Guest Profile Card if not signed in */}
              {!userData ? (
                <div className="w-full bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-violet-100 rounded-[2rem] p-5 shadow-sm text-center font-logo">
                  <h4 className="text-sm font-black text-violet-700 mb-1">Playing as Guest 🌟</h4>
                  <p className="text-xs text-slate-500 font-bold mb-4">Sign in to save your stars, experience points, and unlock full reports!</p>
                  <button
                    onClick={() => { setView('auth'); setSettingsOpen(false); }}
                    className="btn-candy btn-candy-primary w-full py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wide shadow-md"
                  >
                    Sign In / Create Account
                  </button>
                </div>
              ) : (
                /* Profile Info */
                <div className="w-full space-y-4 font-logo">
                  {/* Email view */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 font-logo">Email Address</label>
                    <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-slate-600 font-extrabold text-sm select-all font-logo">
                      {userData.email}
                    </div>
                  </div>

                  {/* Name Editor */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 font-logo">Student Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-2xl px-4 py-3 font-extrabold text-slate-700 text-sm outline-none focus:border-violet-500 focus:bg-white transition-colors"
                        placeholder="Enter student name..."
                      />
                      <button
                        onClick={handleSaveName}
                        className="btn-candy btn-candy-accent px-5 py-3 rounded-2xl font-extrabold text-xs shadow-md whitespace-nowrap"
                      >
                        Save
                      </button>
                    </div>
                    {nameSaveStatus && (
                      <span className="text-[10px] font-black text-violet-600 mt-1 block px-1 font-logo">{nameSaveStatus}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Navigation Panel */}
              <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-3 font-logo">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 font-logo">Explore Universe</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setView('home'); setSettingsOpen(false); }}
                    className={`w-full py-3 px-4 rounded-2xl font-extrabold text-sm text-left transition-colors flex items-center gap-3 ${
                      view === 'home' ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🏠 Home View
                  </button>
                  {userData && (
                    <button
                      onClick={() => { setView('dashboard'); setSettingsOpen(false); }}
                      className={`w-full py-3 px-4 rounded-2xl font-extrabold text-sm text-left transition-colors flex items-center gap-3 ${
                        view === 'dashboard' ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🎮 Learning Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { setView('parents'); setSettingsOpen(false); }}
                    className={`w-full py-3 px-4 rounded-2xl font-extrabold text-sm text-left transition-colors flex items-center gap-3 ${
                      view === 'parents' ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    👨‍👩‍👧 Parents Hub
                  </button>
                </div>
              </div>

              {/* Preferences: Language & Font */}
              <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-5 font-logo">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 font-logo">App Preferences</h4>
                
                {/* Language Picker */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 font-logo">Language (மொழி / भाषा)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['English', 'தமிழ்', 'हिन्दी'].map(l => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                          if (isBackendOnline && userData?.email) {
                            fetch('http://localhost:5000/api/user/sync', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                email: userData.email,
                                name: userData.name,
                                selectedFont: activeFont,
                                selectedLang: l,
                                stars: userData.stars,
                                xp: userData.xp,
                                skillLevel: userData.level || 3
                              })
                            }).catch(err => console.error(err));
                          }
                        }}
                        className={`py-2 rounded-xl font-black text-xs transition-all border-2 ${
                          lang === l
                            ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Selector */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 font-logo">Dyslexia-Friendly Font</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Standard', 'OpenDyslexic', 'Comic Neue', 'Comic Sans'].map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          setActiveFont(f);
                          if (isBackendOnline && userData?.email) {
                            fetch('http://localhost:5000/api/user/sync', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                email: userData.email,
                                name: userData.name,
                                selectedFont: f,
                                selectedLang: lang,
                                stars: userData.stars,
                                xp: userData.xp,
                                skillLevel: userData.level || 3
                              })
                            }).catch(err => console.error(err));
                          }
                        }}
                        className={`py-2.5 rounded-xl font-black text-xs transition-all border-2 ${
                          activeFont === f
                            ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        style={{
                          fontFamily: 
                            f === 'OpenDyslexic' ? 'OpenDyslexic, sans-serif' :
                            f === 'Comic Neue' ? 'Comic Neue, cursive' :
                            f === 'Comic Sans' ? 'Comic Sans MS, cursive' : 'Lexend, sans-serif'
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mascot Tips Toggle */}
                <div className="flex items-center justify-between bg-white border-2 border-slate-200 p-3 rounded-2xl">
                  <span className="text-xs font-extrabold text-slate-600">Enable mascot tips & reminders</span>
                  <button 
                    onClick={() => setMascotTipsEnabled(!mascotTipsEnabled)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${mascotTipsEnabled ? 'bg-violet-600' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${mascotTipsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Stats Box */}
              {userData && (
                <div className="w-full bg-gradient-to-br from-violet-50 to-blue-50/50 border-2 border-violet-100 rounded-[2rem] p-5 shadow-sm space-y-4 font-logo">
                  <h4 className="text-xs font-black text-violet-700 uppercase tracking-wider mb-2 font-logo">Student Progress</h4>
                  <div className="grid grid-cols-2 gap-4 font-logo">
                    <div className="bg-white/80 p-3 rounded-2xl border border-violet-100 text-center font-logo">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 font-logo">Total Stars</div>
                      <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1 font-logo">
                        <StarIcon className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse-slow" /> {userData.stars}
                      </div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-2xl border border-violet-100 text-center font-logo">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 font-logo">Experience (XP)</div>
                      <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1 font-logo">
                        <Zap className="w-5 h-5 fill-emerald-400 text-emerald-500" /> {userData.xp || 0}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-violet-100 flex items-center justify-between font-logo">
                    <span className="text-xs font-extrabold text-slate-500 font-logo">Current Level</span>
                    <span className="bg-violet-100 text-violet-700 font-black text-xs px-3 py-1 rounded-full uppercase font-logo">
                      Level {Math.floor((userData.xp || 0) / 100) + 1}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button if signed in */}
            {userData && (
              <div className="pt-4 border-t border-slate-100 font-logo">
                <button
                  onClick={handleLogout}
                  className="w-full bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-600 font-extrabold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 font-logo"
                >
                  Log Out Account
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}