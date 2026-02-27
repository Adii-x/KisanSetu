import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    0: { transcript: string };
  }>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: () => void;
  onresult: (event: SpeechRecognitionEventLike) => void;
  start: () => void;
};

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
};

const VoiceAssistant = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-US';
    speechSynthesis.speak(utterance);
  }, [i18n.language]);

  const processCommand = useCallback((text: string) => {
    const lower = text.toLowerCase();
    if (lower.match(/order|ऑर्डर/)) {
      navigate('/orders');
      speak('Showing your orders');
    } else if (lower.match(/market|बाज़ार|बाजार/)) {
      navigate('/marketplace');
      speak('Opening marketplace');
    } else if (lower.match(/analytics|विश्लेषण/)) {
      navigate('/analytics');
      speak('Opening analytics');
    } else if (lower.match(/community|समुदाय/)) {
      navigate('/community');
      speak('Opening community');
    } else if (lower.match(/hindi|हिंदी/)) {
      i18n.changeLanguage('hi');
      speak('भाषा हिंदी में बदल दी गई');
    } else if (lower.match(/marathi|मराठी/)) {
      i18n.changeLanguage('mr');
      speak('भाषा मराठीमध्ये बदलली');
    } else if (lower.match(/english|अंग्रेज/)) {
      i18n.changeLanguage('en');
      speak('Language switched to English');
    } else if (lower.match(/home|होम|मुख्य/)) {
      navigate('/');
      speak('Going home');
    } else {
      speak('Sorry, I did not understand. Please try again.');
    }
    toast.info(`🎙️ "${text}"`);
  }, [navigate, speak, i18n]);

  const startListening = () => {
    const { SpeechRecognition, webkitSpeechRecognition } = window as SpeechRecognitionWindow;
    const RecognitionConstructor = SpeechRecognition ?? webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new RecognitionConstructor();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); toast.error('Voice recognition error'); };
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };
    recognition.start();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={startListening}
      className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
        listening
          ? 'bg-destructive text-destructive-foreground animate-pulse'
          : 'bg-secondary text-secondary-foreground glow-pulse'
      }`}
      title={listening ? t('voice.listening') : t('voice.speak')}
    >
      {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </motion.button>
  );
};

export default VoiceAssistant;
